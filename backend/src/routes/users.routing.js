import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';

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