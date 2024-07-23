import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';
import { blacklistToken } from '../jwt/blacklist.jwt.js';
import argon2 from 'argon2';
import { validateUserUpdate } from '../validation/user.validation.js';
import { generateEmailVerificationLink, sendVerificationMail, resetVerificationStatus } from '../auth/verificateEmailAddress.auth.js';
import isCsrfTokenValid from '../middlewares/isCsrfTokenValid.middleware.js';


export default function users(app){
    app.route('/api/user')
        .get(async (req, res) => {
            try{
                const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
                const user = await getUserFullInfo(decodedToken.userID);
                res.status(200).json({
                    status: 200,
                    message: "User found",
                    user: user
                });
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: err
                });
            }
        })
        .put(isCsrfTokenValid(), validateUserUpdate(), deleteUpdateUser)
        .delete(isCsrfTokenValid(), deleteUpdateUser)
}

function getUserFullInfo(userID){
    return new Promise(async (resolve, reject) => {
        try{
            const user = await prisma.user.findUniqueOrThrow({
                include: {
                    credential: {
                        select: {
                            email: true,
                            verified: true
                        }
                    }
                },
                where: {
                    userID: userID
                }
            });
            resolve(user);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Invalid values');
            else if(err.code === 'P2025') reject('User not found or invalid request values.');
            else reject('Unknown error.');
        }
    });
}

async function deleteUpdateUser(req, res){
    const decodedToken = decodeToken(req.headers.authorization, false);
    try{
        let user = undefined;
        if(req.method === 'DELETE'){
            const [userPromise, _] = await Promise.all([
                removeUser(decodedToken.userID),
                blacklistToken(req.headers.authorization)
            ]);
            user = userPromise;
            res.clearCookie('csrf', {
                secure: true,
                httpOnly: true,
                sameSite: 'none'
            });
        }
        else if(req.method === 'PUT'){
            user = await updateUser(req.body, decodedToken.userID);
            user.credential = user.credential[0];
            // Ressetting user verification status and re-sending verification code in case the email changed
            // NOTE: user parameters before update are obtained from previous middleware
            if(req.body.email && req.body.email !== req.lastUserValues.email){
                user.credential.verified = false;
                const messageLink = await generateEmailVerificationLink(user.credential.email, true);
                try{
                    await Promise.all([
                        resetVerificationStatus(user.credential.email),
                        sendVerificationMail(user.credential.email, messageLink),
                    ]);
                }catch(err){
                    throw new Error(err.message);
                }
            }
            // Blacklisting the token if the password changes
            if(req.body.password && !(await argon2.verify(req.lastUserValues.password, req.body.password))){
                await blacklistToken(req.headers.authorization);
                res.clearCookie('csrf', {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'none'
                });
            }
        }
        res.status(200).json({
            status: 200,
            message: req.method === 'DELETE'? "User successfully removed": "User data successfully updated",
            user: user
        });
    }catch(err){
        res.status(404).json({
            status: 404,
            message: err
        });
    }
}

function updateUser(userInfo, userID){
    // Hashing the password and adding it to the Object if the `password` field is passed and it's not empty
    return new Promise(async (resolve, reject) => {
        if(userInfo.password && userInfo.password !== '') userInfo.hashedPass = await argon2.hash(userInfo.password);
        try{
            const user = prisma.user.update({
                data: {
                    firstName: userInfo.firstName && userInfo.firstName !== ''? userInfo.firstName: undefined,
                    lastName: userInfo.firstName && userInfo.firstName !== ''? userInfo.lastName: undefined,
                    credential: {
                        update: {
                            data: {
                                email: userInfo.email && userInfo.email !== ''? userInfo.email: undefined,
                                password: userInfo.hashedPass? userInfo.hashedPass: undefined,
                                updatedAt: userInfo.hashedPass? Math.floor(Date.now() / 1000): undefined
                            },
                            where: {
                                userID: userID
                            }
                        },
                    },
                },
                include: {
                    credential: {
                        select: {
                            email: true,
                            verified: true
                        }
                    }
                },
                where: {
                    userID: userID
                }
            });
            resolve(user);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Invalid values');
            else if(err.code === 'P2025') reject('User not found or invalid request values.');
            else reject('Unknown error.');
        }
    });
}

function removeUser(userID){
    return new Promise(async (resolve, reject) => {
        try{
            const removedUser = await prisma.user.delete({
                where: {
                    userID: userID
                }
            });
            resolve(removedUser);
        }catch(err){
            reject(err.code === 'P2025'? 'User not found.': 'Unknown error.');
        }
    });
}