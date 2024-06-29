import prisma from '../../db/prisma.db.js';
import { validateJWT } from '../auth/jwt.auth.js';
import decodeToken from '../jwt/decode.jwt.js';
import 'dotenv/config';


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