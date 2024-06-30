import prisma from '../../db/prisma.db.js';
import { validateJWT } from '../auth/jwt.auth.js';
import decodeToken from '../jwt/decode.jwt.js';
import 'dotenv/config';
import ejs from 'ejs'
import configureMailingSystem from '../mail/configure.mail.js';
import { findUser } from '../apis/findUser.api.js';
import generateEmailVerificationLink from '../auth/verificateEmailAddress.auth.js';


export default function emailAddressVerification(app){
    app.post('/user/verify', async (req, res) => {
        const token = req.body.verificationToken;
        try{
            await validateJWT(token, process.env.JWT_MAIL_VERIFICATION_SECRET);
        }catch(err){
            res.status(401).json({
                status: 401,
                message: "Token not found or invalid"
            });
            return;
        }
        const decodedToken = decodeToken(token, false);
        try{
            const message = await removeVerificationMessage(decodedToken.messageID);
            await verifyEmailAddress(message.email);
            res.status(200).json({
                status: 200,
                message: "Email address verified"
            });
        }catch(err){
            res.status(403).json({
                status: 403,
                message: 'Invalid token or email address not found'
            });
        }
    });

    app.post('/user/verify/generate', async (req, res) => {
        let user;
        try{
            const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
            user = await findUser(decodedToken.userID, true, false);
        }catch(err){
            res.status(404).json({
                status: 404,
                message: err.message
            });
            return;
        }
        if(user.verified){
            res.status(401).json({
                status: 401,
                message: "Email address already verified."
            });
            return;
        }
        const messageLink = await generateEmailVerificationLink(user.email, true);
        try{
            await sendVerificationMail(user.email, messageLink);
        }catch(err){
            res.status(404).json({
                status: 404,
                message: err.message
            });
            return;
        }
        res.status(201).json({
            status: 201,
            message: "Verification code sent."
        });
    });
}

function removeVerificationMessage(messageID){
    /*
        * Finds and removes the email verification message
        * If the message is not found, the promise is rejected,
        * otherwise resolved with the `messageID` and relative `email` address to be verified
    */
    return new Promise(async (resolve, reject) => {
        try{
            const message = await prisma.verification.delete({
                where: {
                    messageID: messageID
                }
            });
            resolve(message);
        }catch(err){
            reject(err.code === 'P2025'? 'Verification code not found.': 'Unknown error.');
        }
    });
}

function verifyEmailAddress(email){
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

function sendVerificationMail(recipient, verificationLink){
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