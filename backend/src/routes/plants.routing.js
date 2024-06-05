import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';

export default function plants(app){
    app.route('/api/plants')
        .get(async (req, res) => {
            /*
                * Gets a single plant from a given `plantID` (in request body) and userID (in JWT payload)
            */
            try{
                const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
                const plant = await getUserPlant(parseInt(req.query.plantID) || 0, decodedToken.userID);
                res.status(200).json({
                    status: 200,
                    message: "Plant found",
                    plants: plant
                });
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: "No plants found"
                });
            }
        })
    
    app.get('/api/plants/all', async (req, res) => {
        /*
            * Gets all plants from a given userID (in JWT payload)
        */
        const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
        const plantsList = await getUserPlantsList(parseInt(req.query.plantationID) || 0, decodedToken.userID);
        res.status(200).json({
            status: 200,
            message: "Plants found",
            plants: plantsList
        });
    });
}

function getUserPlant(plantID, userID){
    /*
        * Obtains a specific plant owned by the user
        * NOTE: The `plantID` and `userID` params MUST be integers
    */
    return new Promise(async (resolve, reject) => {
        try{
            const plant = await prisma.plantation_Plant.findUniqueOrThrow({
                include: {
                    plannedTreatment: {
                        select: {
                            plantationPlantID: true,
                            treatmentType: true,
                            treatmentDate: true,
                            treatmentRecurrence: true,
                            notes: true
                        }
                    },
                    plant: true
                },
                where: {
                    plantationPlantID: plantID,
                    plantation: {
                        userID: userID,
                    }
                }
            });
            resolve(plant);
        }catch(err){
            reject('No plants found.');
        }
    });
}

function getUserPlantsList(plantationID, userID){
    /*
        * Obtains a list with all plants in a plantation
        * NOTE: The `plantationID` and `userID` parameters MUST be integers
    */
    return new Promise(async (resolve, reject) => {
        const plants = await prisma.plantation_Plant.findMany({
            include: {
                plannedTreatment: {
                    select: {
                        plantationPlantID: true,
                        treatmentType: true,
                        treatmentDate: true,
                        treatmentRecurrence: true,
                        notes: true
                    }
                },
                plant: true
            },
            where: {
                plantationID: plantationID,
                plantation: {
                    userID: userID
                }
            }
        });
        resolve(plants);
    });
}