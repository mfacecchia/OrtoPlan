import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';

export default function plantations(app){
    app.post('/api/plantations', async (req, res) => {
        /*
            * Gets a single plantation from a given `plantationID` (in request body) and userID (in JWT payload)
        */
        try{
            const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
            const plantation = await getPlantation(parseInt(req.body.plantationID) || 0, decodedToken.userID);
            res.status(200).json({
                status: 200,
                message: "Plantation found",
                plantation: plantation
            });
        }catch(err){
            res.status(404).json({
                status: 404,
                message: "Plantation not found"
            });
        }
    });
}

function getPlantation(plantationID, userID){
    return new Promise(async (resolve, reject) => {
        try{
            const plantation = await prisma.plantation.findUniqueOrThrow({
                select: {
                    plantationName: true,
                    imageURL: true,
                    location: true
                },
                where: {
                    plantationID: plantationID,
                    userID: userID
                }
            });
            resolve(plantation);
        }catch(err){
            console.log(err);
            reject('Plantation not found.');
        }
    });
}