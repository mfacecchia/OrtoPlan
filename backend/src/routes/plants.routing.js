import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';
import getPlant from '../apis/getPlant.api.js';
import { getPlantation } from './plantations.routing.js';

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
        .post(async (req, res) => {
            req.body.plantationID = parseInt(req.body.plantationID) || 0;
            // Data to pass to the function
            const plantData = { plantationID: req.body.plantationID };
            try{
                const plant = await(getPlant(req.body.plantName, req.body.plantFamily, req.body.plantScientificName))
                plantData.plantID = plant.plantID;
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: "Plant not found"
                });
                return;
            }
            try{
                const decodedToken = decodeToken(req.headers.authorization, false);
                await getPlantation(req.body.plantationID, decodedToken.userID);
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: "Plantation not found"
                });
                return;
            }
            try{
                const newPlant = await createPlant(plantData);
                res.status(201).json({
                    status: 201,
                    message: "Plant successfully created",
                    plant: newPlant
                });
            }catch(err){
                res.status(400).json({
                    status: 400,
                    message: "Unknown error while creating the plant. Please try again."
                });
                return;
            }
        })
        .put(deleteUpdatePlant)

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
                    plannedTreatment: true,
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
                plannedTreatment: true,
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

function createPlant(plantData){
    return new Promise(async (resolve, reject) => {
        try{
            const newPlant = await prisma.plantation_Plant.create({
                data: {
                    plantationID: plantData.plantationID,
                    plantID: plantData.plantID
                },
                include: {
                    plant: true
                }
            });
            resolve(newPlant);
        }catch(err){
            reject(false);
        }
    });
}

async function deleteUpdatePlant(req, res){
    req.body.plantationPlantID = parseInt(req.body.plantationPlantID) || 0;
    try{
        let plant = undefined;
        const decodedToken = decodeToken(req.headers.authorization, false);
        const userID = decodedToken.userID;
        if(req.method === 'DELETE') plant = await removePlant(req.body.plantID, userID);
        else if(req.method === 'PUT'){
            const plantData = await getPlant(req.body.plantName, req.body.plantFamily, req.body.scientificName);
            req.body.plantID = plantData.plantID;
            plant = await updatePlant(req.body, userID);
        }
        res.status(200).json({
            status: 200,
            message: req.method === 'DELETE'? "Plant successfully removed": "Plant data successfully updated",
            plant: plant
        });
    }catch(err){
        console.error(err);
        res.status(404).json({
            status: 404,
            message: err
        });
    }
}

function updatePlant(plantData){
    return new Promise(async (resolve, reject) => {
        try{
            const updatedPlant = await prisma.plantation_Plant.update({
                data: {
                    plantID: plantData.plantID
                },
                include: {
                    plannedTreatment: true,
                    plant: true
                },
                where: {
                    plantationPlantID: plantData.plantationPlantID
                }
            });
            resolve(updatedPlant);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Invalid values');
            else if(err.code === 'P2025') reject('Plantation not found or invalid update values.');
            else reject('Unknown error.');
        }
    });
}