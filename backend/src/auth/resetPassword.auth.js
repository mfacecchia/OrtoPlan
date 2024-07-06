import jwt from 'jsonwebtoken';
import prisma from "../../db/prisma.db.js";
import 'dotenv/config';
import ejs from 'ejs'
import configureMailingSystem from '../mail/configure.mail.js';


export async function generatePasswordResetLink(userEmail, returnLink = false){
    const messageID = await createMessage(userEmail);
    const token = jwt.sign({
        messageID: messageID.messageID
    }, process.env.JWT_USER_ACTIONS_SECRET, {
        expiresIn: '10m'
    });
    if(returnLink) return `${process.env.FRONTEND_ADDRESS + ':' + process.env.FRONTEND_PORT}/user/reset?q=${token}`;
    return token;
}

export function removePasswordResetMessage(messageID){
    /*
        * Finds and removes the password reset message
        * If the message is not found, the promise is rejected,
        * otherwise resolved with the `messageID` and relative `email` that needs password to be reset
    */
    return new Promise(async (resolve, reject) => {
        try{
            const message = await prisma.userAction.delete({
                where: {
                    messageID: messageID,
                    actionType: "passwordReset"
                }
            });
            resolve(message);
        }catch(err){
            reject(err.code === 'P2025'? 'Password reset code not found.': 'Unknown error.');
        }
    });
}

export function updatePassword(userEmail, newPassword){
    return new Promise(async (resolve, reject) => {
        try{
            await prisma.credentials.update({
                data: {
                    password: newPassword
                },
                where: {
                    email: userEmail
                }
            });
            resolve(true);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Invalid values');
            else if(err.code === 'P2025') reject('User not found or invalid update values.');
            else reject('Unknown error.');
        }
    });
}

export function sendPasswordResetMail(recipient, passwordResetLink){
    return new Promise((resolve, reject) => {
        const transporter = configureMailingSystem();
        let renderedHTMLTemplate = undefined;
        // Rendering HTML templayte with all the data passed as function arguments
        ejs.renderFile(`src/mail/templates/resetPassword.mail.template.ejs`, {passwordResetLink: passwordResetLink}, (error, htmlStr) => {
            if(error){
                reject("Could not generate email.");
                return
            }
            renderedHTMLTemplate = htmlStr;
        });
        if(!renderedHTMLTemplate){
            reject("Could not generate email.");
            return;
        }
        transporter.sendMail({
            from: `OrtoPlan Mailing System <${process.env.MAILING_SYSTEM_ADDRESS}>`,
            to: recipient,
            subject: "Reset your OrtoPlan account password",
            text: `You're receiving this email because you recently requested a password reset. If it was you making the request, please copy the link below and paste it in your favourite web browser to update your account's password. If it wasn't you, then you don't have to do anything and you can delete this email.\nLink to copy: ${passwordResetLink} \n\nFrom the bottom of our heart.\n- The OrtoPlan Team`,
            html: renderedHTMLTemplate,
            attachments: [
                {
                    filename: 'favicon.webp',
                    path: `src/mail/assets/icons/favicon.webp`,
                    cid: 'OrtoPlanLogo'
                },
                {
                    filename: 'footer.webp',
                    path: `src/mail/assets/icons/footer.webp`,
                    cid: 'OrtoPlanFooterBG'
                }
            ]
        }, (error, info) => {
            if(error) reject("Could not send email.");
            else resolve(true);
        });
    });
}

function createMessage(userEmail){
    return new Promise(async (resolve, reject) => {
        const message = await prisma.userAction.create({
            data: {
                email: userEmail,
                actionType: "passwordReset"
            },
            select: {
                messageID: true
            }
        });
        resolve(message);
    });
}