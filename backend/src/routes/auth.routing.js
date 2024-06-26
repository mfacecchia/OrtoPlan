import prisma from '../../db/prisma.db.js';
import argon2 from 'argon2';
import { generateJWT, validateJWT } from '../auth/jwt.auth.js';
import { findUser } from '../middlewares/findUser.middleware.js';
import { validateLoginSignup } from '../validation/user.validation.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import sendWelcomeEmail from '../mail/welcome.mail.js';
import decodeToken from '../jwt/decode.jwt.js';


export default function userAuth(app){
    app.post('/user/signup', isLoggedIn(), validateLoginSignup(false), async (req, res) => {
        try{
            const hashedPass = await hashPassword(req.body.password);
            await newUser(req.body, hashedPass);
            await sendWelcomeEmail(req.body.email, req.body.firstName, req.body.lastName);
            res.status(201).json({
                status: 201,
                message: "User created successfully"
            });
        }catch(err){
            res.status(400).json({
                status: 400,
                message: "Unknown error. Please try again later."
            });
        }
    });

    app.post('/user/login', isLoggedIn(), validateLoginSignup(true), async (req, res) => {
        try{
            const userExists = await findUser(req.body.email, false);
            const isValid = await argon2.verify(userExists.password, req.body.password);
            if(!isValid) throw new Error(false);
            const token = await generateJWT({
                userID: userExists.userID
            }, Boolean(req.body.rememberMe));
            res.status(200).json({
                status: 200,
                message: "Logged in successfully.",
                token: token,
                verified: userExists.verified
            });
        }catch(err){
            res.status(404).json({
                status : 404,
                message: "User not found. Please try again."
            });
        }
    });

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

async function newUser(userInfo, hashedPass){
    return new Promise(async (resolve, reject) => {
        try{
            const user = prisma.user.create({
                data: {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    credential: {
                        create: {
                            email: userInfo.email,
                            password: hashedPass
                        }
                    }
                }
            });
            resolve(user);
        }catch(err){
            reject(err.message);
        }
    });
}

function hashPassword(clearPass){
    return new Promise(async (resolve, reject) => {
        try{
            const hashedPass = await argon2.hash(clearPass);
            resolve(hashedPass);
        }catch(err){
            reject('Could not hash password.');
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