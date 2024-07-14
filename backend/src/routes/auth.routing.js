import prisma from '../../db/prisma.db.js';
import argon2 from 'argon2';
import { generateJWT } from '../auth/jwt.auth.js';
import { findUser } from '../apis/findUser.api.js';
import { validateLoginSignup } from '../validation/user.validation.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import sendWelcomeEmail from '../mail/welcome.mail.js';
import { blacklistToken } from '../jwt/blacklist.jwt.js';


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
                message: err
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

    app.post('/user/logout', isLoggedIn(true, false, false), async (req, res) => {
        const token = req.headers.authorization;
        await blacklistToken(token);
        res.status(200).json({
            status: 200,
            message: "Logged out successfully"
        });
        return;
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
                            password: hashedPass,
                            updatedAt: Math.floor(Date.now() / 1000)
                        }
                    }
                }
            });
            resolve(user);
        }catch(err){
            reject("Could not create user.");
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