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
                plantations: plantation
            });
        }catch(err){
            res.status(404).json({
                status: 404,
                message: "No plantations found"
            });
        }
    });
    
    app.get('/api/plantations/all', async (req, res) => {
        /*
            * Gets all plantations from a given userID (in JWT payload)
        */
        const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
        const plantationsList = await getPlantationsList(decodedToken.userID);
        res.status(200).json({
            status: 200,
            message: "Plantations found",
            plantations: plantationsList
        });
    });
}

function getPlantation(plantationID, userID){
    return new Promise(async (resolve, reject) => {
        try{
            const plantation = await prisma.plantation.findUniqueOrThrow({
                include: {
                    location: {
                        select: {
                            locationName: true,
                            locationCAP: true,
                            locationLat: true,
                            locationLong: true
                        }
                    }
                },
                where: {
                    userID: userID,
                    plantationID: plantationID
                }
            });
            resolve(plantation);
        }catch(err){
            reject('No plantations found.');
        }
    });
}

function getPlantationsList(userID){
    return new Promise(async (resolve, reject) => {
        const plantation = await prisma.plantation.findMany({
            include: {
                location: {
                    select: {
                        locationName: true,
                        locationCAP: true,
                        locationLat: true,
                        locationLong: true
                    }
                }
            },
            where: {
                userID: userID
            }
        });
        resolve(plantation);
    });
}