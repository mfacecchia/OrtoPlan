import prisma from '../../db/prisma.db.js';
import argon2 from 'argon2';
import { generateJWT, validateJWT } from '../auth/jwt.auth.js';
import { findUserByEmail } from '../middlewares/findUser.middleware.js';
import { validateForm } from '../validation/user.validation.js';


export default function userAuth(app){
    app.post('/user/signup', isLoggedIn, validateForm(false), async (req, res) => {
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

    app.post('/user/login', async (req, res) => {
        try{
            const userExists = await findUserByEmail(req.body.email);
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

// TODO: Move this to middlewares directory
async function isLoggedIn(req, res, next){
    /*
        Checks if the user is logged in by checking for token presence in the Authorization header and eventual validity
    */
    try{
        const token = req.headers.authorization;
        if(token){
            await validateJWT(token.replace('Bearer ', ''));
            // TODO: Check if the user still exists in the database before returning 200 OK status code
            res.status(200).json({
                status: 200,
                message: "Logged in successfully."
            });
            return;
        }
    }catch(err){
        res.status(401).json({
            status: 401,
            message: err.message || err
        });
        return;
    }
    next();
}