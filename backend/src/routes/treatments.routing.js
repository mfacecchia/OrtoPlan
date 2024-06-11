import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';
import { getUserPlant } from '../apis/getPlant.api.js'
import { validateTreatment } from '../validation/treatments.validation.js';


export default function treatments(app){
    app.route('/api/treatments')
        .get(async (req, res) => {
            /*
                * Gets a single treatment from a given `treatmentID` (in request body), and userID (in JWT payload)
                * Returns all treatment's information as well as all relative plant and plantation's treatment
            */
            try{
                const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
                const treatment = await getPlantTreatment(parseInt(req.query.treatmentID) || 0, decodedToken.userID);
                res.status(200).json({
                    status: 200,
                    message: "Treatment found",
                    treatments: treatment
                });
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: err
                });
            }
        })
        .post(validateTreatment(), async (req, res) => {
            // Passing all required data to create a treatment in an Object that will be passed to the appropriate function later on
            const treatmentData = {};
            ['treatmentType', 'notes', 'treatmentDate', 'treatmentRecurrence', 'plantationPlantID'].forEach(key => {
                treatmentData[key] = req.body[key];
            });
            // Checking if the plant exists and is actually owned by the user who's making the request
            try{
                const decodedToken = decodeToken(req.headers.authorization, false);
                await getUserPlant(req.body.plantationPlantID, decodedToken.userID);
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: "Plant not found"
                });
                return;
            }
            try{
                const newTreatment = await createTreatment(treatmentData);
                res.status(201).json({
                    status: 201,
                    message: "Treatment successfully planned",
                    treatment: newTreatment
                });
            }catch(err){
                res.status(400).json({
                    status: 400,
                    message: err
                });
                return;
            }
        })
        .put(validateTreatment(), deleteUpdateTreatment)
        .delete(deleteUpdateTreatment)

    app.get('/api/treatments/all', async (req, res) => {
        /*
            * Gets all treatments from a given `plantationPlantID` (in request body), and userID (in JWT payload)
            * Returns an Array with all treatments' information as well as all relative plant and plantation's information
        */
        const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
        const treatment = await getPlantTreatmentsList(parseInt(req.query.plantationPlantID) || undefined, decodedToken.userID);
        res.status(200).json({
            status: 200,
            message: "Treatments found",
            treatments: treatment
        });
    });
}

function getPlantTreatment(treatmentID, userID){
    return new Promise(async (resolve, reject) => {
        try{
            const treatment = await prisma.plannedTreatment.findUniqueOrThrow({
                include: {
                    plantationPlant: {
                        select: {
                            plantationPlantID: true,
                            plant: true,
                            plantation: true
                        }
                    }
                },
                where: {
                    treatmentID: treatmentID,
                    plantationPlant: {
                        plantation: {
                            userID: userID
                        }
                    }
                }
            });
            resolve(treatment);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Invalid values');
            else if(err.code === 'P2025') reject('Treatment not found or invalid request values.');
            else reject('Unknown error.');
        }
    });
}

function getPlantTreatmentsList(plantationPlantID, userID){
    return new Promise(async (resolve, reject) => {
        const treatment = await prisma.plannedTreatment.findMany({
            include: {
                plantationPlant: {
                    select: {
                        plantationPlantID: true,
                        plant: true,
                        plantation: true
                    }
                }
            },
            where: {
                plantationPlantID: plantationPlantID,
                plantationPlant: {
                    plantation: {
                        userID: userID
                    }
                }
            }
        });
        resolve(treatment);
    });
}

function createTreatment(treatmentData){
    return new Promise(async (resolve, reject) => {
        try{
            const newTreatment = await prisma.plannedTreatment.create({
                data: treatmentData
            });
            resolve(newTreatment);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Missing data or invalid values.')
            else reject('Unknown error while creating the treatment. Please try again later.');
        }
    });
}

async function deleteUpdateTreatment(req, res){
    const treatmentData = {};
    // Passing all required data to create a treatment in an Object that will be passed to the appropriate function later on
    ['treatmentType', 'notes', 'treatmentDate', 'treatmentRecurrence', 'treatmentID'].forEach(key => {
        treatmentData[key] = req.body[key];
    });
    const decodedToken = decodeToken(req.headers.authorization, false);
    try{
        let treatment = undefined;
        if(req.method === 'DELETE') treatment = await removeTreatment(parseInt(treatmentData.treatmentID) || 0, decodedToken.userID);
        else if(req.method === 'PUT') treatment = await updateTreatment(treatmentData, decodedToken.userID);
        res.status(200).json({
            status: 200,
            message: req.method === 'DELETE'? "Treatment successfully removed": "Treatment data successfully updated",
            treatment: treatment
        });
    }catch(err){
        res.status(404).json({
            status: 404,
            message: err
        });
    }
}

function updateTreatment(treatmentData, userID){
    return new Promise(async (resolve, reject) => {
        try{
            const newTreatment = await prisma.plannedTreatment.update({
                data: treatmentData,
                where: {
                    treatmentID: treatmentData.treatmentID,
                    plantationPlant: {
                        plantation: {
                            userID: userID
                        }
                    }
                }
            });
            resolve(newTreatment);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Missing data or invalid values.')
            else if(err.code === 'P2025') reject('Treatment not found or invalid update values.');
            else reject('Unknown error while updating the treatment. Please try again later.');
        }
    });
}

function removeTreatment(treatmentID, userID){
    return new Promise(async (resolve, reject) => {
        try{
            const removedTreatment = await prisma.plannedTreatment.delete({
                where: {
                    treatmentID: treatmentID,
                    plantationPlant: {
                        plantation: {
                            userID: userID
                        }
                    }
                }
            });
            resolve(removedTreatment);
        }catch(err){
            reject(err.code === 'P2025'? 'Treatment not found.': 'Unknown error.');
        }
    });
}