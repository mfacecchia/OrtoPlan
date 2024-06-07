import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';
import argon2 from 'argon2';


export default function users(app){
    app.route('/api/user')
        .get(async (req, res) => {
            try{
                const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
                const user = await getUser(decodedToken.userID);
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
        .put(deleteUpdateUser)
        .delete(deleteUpdateUser)
}

function getUser(userID){
    return new Promise(async (resolve, reject) => {
        try{
            const user = await prisma.user.findUniqueOrThrow({
                include: {
                    credential: {
                        select: {
                            email: true
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
        if(req.method === 'DELETE') user = await removeUser(decodedToken.userID)
        else if(req.method === 'PUT') user = await updateUser(req.body, decodedToken.userID);
        res.status(200).json({
            status: 200,
            message: req.method === 'DELETE'? "User successfully removed": "User data successfully updated",
            user: user
        });
    }catch(err){
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err
        });
    }
}

function updateUser(userInfo, userID){
    // Hashing the password and adding it to the Object if the `password` field is passed and it's not empty
    return new Promise(async (resolve, reject) => {
        if(userInfo.password && userInfo.password !== '') userInfo.hashedPass = await argon2.hash(req.body.password);
        try{
            const user = prisma.user.update({
                data: {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    credential: {
                        update: {
                            data: {
                                email: userInfo.email && userInfo.email !== ''? userInfo.email: undefined,
                                password: userInfo.hashedPass? userInfo.hashedPass: undefined
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
                            email: true
                        }
                    }
                },
                where: {
                    userID: userID
                }
            });
            resolve(user);
        }catch(err){
            console.log(err);
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