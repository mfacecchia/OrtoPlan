import jwt from 'jsonwebtoken';
import prisma from "../../db/prisma.db.js";
import 'dotenv/config';
import ejs from 'ejs'
import configureMailingSystem from '../mail/configure.mail.js';


export async function generateEmailVerificationLink(userEmail, returnLink = false){
    const messageID = await createMessage(userEmail);
    const token = jwt.sign({
        messageID: messageID.messageID
    }, process.env.JWT_USER_ACTIONS_SECRET, {
        expiresIn: '10m'
    });
    if(returnLink) return `${process.env.FRONTEND_ADDRESS + ':' + process.env.FRONTEND_PORT}/user/verify?q=${token}`;
    return token;
}

export function removeVerificationMessage(messageID){
    /*
        * Finds and removes the email verification message
        * If the message is not found, the promise is rejected,
        * otherwise resolved with the `messageID` and relative `email` address to be verified
    */
    return new Promise(async (resolve, reject) => {
        try{
            const message = await prisma.userAction.delete({
                where: {
                    messageID: messageID,
                    actionType: "emailVerification"
                }
            });
            resolve(message);
        }catch(err){
            reject(err.code === 'P2025'? 'Verification code not found.': 'Unknown error.');
        }
    });
}

export function verifyEmailAddress(email){
    return new Promise(async (resolve, reject) => {
        try{
            await prisma.credentials.update({
                data: {
                    verified: true
                },
                where: {
                    email: email
                }
            });
            resolve(true);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Invalid values');
            else if(err.code === 'P2025') reject('Email address not found or invalid update values.');
            else reject('Unknown error.');
        }
    });
}

export function sendVerificationMail(recipient, verificationLink){
    return new Promise((resolve, reject) => {
        const transporter = configureMailingSystem();
        let renderedHTMLTemplate = undefined;
        // Rendering HTML templayte with all the data passed as function arguments
        ejs.renderFile(`src/mail/templates/verifyEmail.mail.template.ejs`, {verificationLink: verificationLink}, (error, htmlStr) => {
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
            subject: "Verify your OrtoPlan Email address",
            text: `You're receiving this email because you recently requested a new email verification code. If it was you making the request, please copy the link below and paste it in your favourite web browser to verify your email address. If it wasn't you, then you don't have to do anything and you can delete this email.\nLink to copy: ${verificationLink} \n\nFrom the bottom of our heart.\n- The OrtoPlan Team`,
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

export function resetVerificationStatus(userEmail){
    return new Promise(async (resolve, reject) => {
        try{
            await prisma.credentials.update({
                data: {
                    verified: false
                },
                where: {
                    email: userEmail
                }
            });
            resolve(true);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Invalid values');
            else if(err.code === 'P2025') reject('User not found or invalid request values.');
            else reject('Unknown error.');
        }
    });
}

function createMessage(userEmail){
    return new Promise(async (resolve, reject) => {
        const message = await prisma.userAction.create({
            data: {
                email: userEmail,
                actionType: "emailVerification"
            },
            select: {
                messageID: true
            }
        });
        resolve(message);
    });
}