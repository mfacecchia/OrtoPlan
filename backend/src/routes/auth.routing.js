import prisma from '../../db/prisma.db.js';
import argon2, { hash } from 'argon2';

export default function userAuth(app){
    app.post('/user/register', async (req, res) => {
        let userExists = undefined;
        try{
            userExists = await prisma.credentials.findUnique({
                where: {
                    email: req.body.email
                }
            });
        }catch(err){
            res.status(400).json({
                status: 400,
                message: "Unknown error. Please try again later."
            });
        }
        if(userExists){
            res.status(403).json({
                status: 403,
                message: "Could not complete the request. User already exists."
            });
            return;
        }
        try{
            const hashedPass = await hashPassword(req.body.password);
            await newUser(req.body, hashedPass);
            res.status(200).json({
                status: 200,
                message: "User created successfully"
            });
        }catch(err){
            res.status(400).json({
                status: 400,
                message: "Unknown error. Please try again later."
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