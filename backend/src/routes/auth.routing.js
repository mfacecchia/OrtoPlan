import prisma from '../../db/prisma.db.js';
import argon2 from 'argon2';
import { generateJWT } from '../auth/jwt.auth.js';

export default function userAuth(app){
    app.post('/user/register', async (req, res) => {
        let userExists = undefined;
        try{
            userExists = await findUser(req.body.email, true);
        }catch(err){
            console.log(err);
            res.status(403).json({
                status: 403,
                message: "Could not complete the request. User already exists."
            });
            return;
        }
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
            const userExists = await findUser(req.body.email);
            const isValid = await argon2.verify(userExists.password, req.body.password);
            if(!isValid) throw new Error(false);
            const token = await generateJWT({
                userID: userExists.userID
            }, req.body.rememberMe);
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
                    name: userInfo.firstName,
                    surname: userInfo.lastName,
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

async function findUser(userEmail, throwOnFound = false){
    /*
        * Finds a user from the database by a given valid `userEmail`
        * Returns a `Promise` that `reject`s if the `throwOnFound` is set to `true`, otherwise `resolve`s
    */
    return new Promise(async (resolve, reject) => {
        let userExists = undefined;
        try{
            userExists = await prisma.credentials.findUniqueOrThrow({
                where: {
                    email: userEmail
                }
            });
            throwOnFound? reject(false): resolve(userExists);
        }catch(err){
            throwOnFound? resolve(userExists): reject(false);
        }
    });
}