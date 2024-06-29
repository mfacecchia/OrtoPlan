import jwt from 'jsonwebtoken';
import prisma from "../../db/prisma.db.js";
import 'dotenv/config';


export default async function generateEmailVerificationLink(userEmail, returnLink = false){
    const messageID = await createMessage(userEmail);
    const token = jwt.sign({
        messageID: messageID.messageID
    }, process.env.JWT_MAIL_VERIFICATION_SECRET, {
        expiresIn: '10m'
    });
    if(returnLink) return `${process.env.FRONTEND_ADDRESS + ':' + process.env.FRONTEND_PORT}/user/verify?q=${token}`;
    return token;
}

function createMessage(userEmail){
    return new Promise(async (resolve, reject) => {
        const message = await prisma.verification.create({
            data: {
                email: userEmail
            },
            select: {
                messageID: true
            }
        });
        resolve(message);
    });
}