import prisma from '../../db/prisma.db.js';
import argon2 from 'argon2';
import { generateJWT, validateJWT } from '../auth/jwt.auth.js';
import { findUser } from '../middlewares/findUser.middleware.js';
import { validateLoginSignup } from '../validation/user.validation.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';


export default function userAuth(app){
    app.post('/user/signup', isLoggedIn(), validateLoginSignup(false), async (req, res) => {
        try{
            const hashedPass = await hashPassword(req.body.password);
            await newUser(req.body, hashedPass);
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
                token: token
            });
        }catch(err){
            res.status(404).json({
                status : 404,
                message: "User not found. Please try again."
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