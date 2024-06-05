import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';
import getLocation from '../apis/getLocation.api.js';

export default function plantations(app){
    app.get('/api/plantations', async (req, res) => {
        /*
            * Gets a single plantation from a given `plantationID` (in request body) and userID (in JWT payload)
        */
        try{
            const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
            const plantation = await getPlantation(parseInt(req.query.plantationID) || 0, decodedToken.userID);
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

    app.post('/api/plantations', async(req, res) => {
        // Data to pass to the function
        const plantationData = {
            plantationName: req.body.plantationName
        }
        try{
            const location = await getLocation(req.body.locationName, req.body.locationCAP);
            plantationData.locationID = location.locationID;
        }catch(err){
            res.status(404).json({
                status: 404,
                message: "Location not found"
            });
            return;
        }
        try{
            const plantationImage = await getRandomImage();
            plantationData.imageURL = plantationImage;
        }catch(err){
            plantationData.imageURL = 'plantation.webp';
        }
        const decodedToken = decodeToken(req.headers.authorization, false);
        plantationData.userID = decodedToken.userID;
        try{
            const newPlantation = await createPlantation(plantationData);
            res.status(201).json({
                status: 201,
                message: "Plantation successfully created",
                plantation: newPlantation
            });
        }catch(err){
            res.status(400).json({
                status: 400,
                message: "Unknown error while creating the plantation. Please try again."
            });
            return;
        }
    });

    app.route('/api/plantations')
        .delete(deleteUpdatePlantation)
        .put(deleteUpdatePlantation);
}

function getRandomImage(){
    return new Promise(async (resolve, reject) => {
        try{
            const res = await fetch('https://api.unsplash.com/search/photos?query=Plantation&per_page=30', {
                method: 'GET',
                headers: {
                    "Authorization": `Client-ID ${process.env.UNSPLASHAPI_KEY}`,
                    "Accept-Version": "v1"
                }
            });
            if(!res.ok) reject(res.status);
            const imageJSON = await res.json();
            const randomImageIndex = Math.floor(Math.random() * imageJSON.results.length);
            resolve(imageJSON.results[randomImageIndex].urls.regular);
        }catch(err){
            reject(err);
        }
    });
}

async function deleteUpdatePlantation(req, res){
    try{
        let plantation = undefined;
        const decodedToken = decodeToken(req.headers.authorization, false);
        const userID = decodedToken.userID;
        if(req.method === 'DELETE') plantation = await removePlantation(req.body.plantationID, userID);
        else if(req.method === 'PUT') plantation = await updatePlantation(req.body, userID);
        res.status(200).json({
            status: 200,
            message: req.method === 'DELETE'? "Plantation successfully removed": "Plantation data successfully updated",
            plantation: plantation
        });
    }catch(err){
        res.status(404).json({
            status: 404,
            message: err
        });
    }
}

function updatePlantation(dataObj, userID){
    return new Promise(async (resolve, reject) => {
        try{
            const location = await getLocation(dataObj.locationName, dataObj.locationCAP)
            const updatedPlantation = await prisma.plantation.update({
                data: {
                    plantationName: dataObj.plantationName,
                    locationID: location.locationID
                },
                include: {
                    location: {
                        select: {
                            locationName: true
                        }
                    }
                },
                where: {
                    plantationID: parseInt(dataObj.plantationID) || 0,
                    userID: userID
                }
            });
            resolve(updatedPlantation);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Invalid values');
            else if(err.code === 'P2025') reject('Plantation not found or invalid update values.');
            else reject('Unknown error.');
        }
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

function createPlantation(plantationData){
    return new Promise(async (resolve, reject) => {
        try{
            const newPlantation = await prisma.plantation.create({
                data: plantationData,
                include: {
                    location: {
                        select: {
                            locationName: true
                        }
                    }
                }
            });
            resolve(newPlantation);
        }catch(err){
            reject(false);
        }
    });
}

function removePlantation(plantationID, userID){
    return new Promise(async (resolve, reject) => {
        try{
            const removedPlantation = await prisma.plantation.delete({
                include: {
                    location: {
                        select: {
                            locationName: true
                        }
                    }
                },
                where: {
                    plantationID: plantationID,
                    userID: userID
                }
            });
            resolve(removedPlantation);
        }catch(err){
            reject(err.code === 'P2025'? 'Plantation not found.': 'Unknown error.');
        }
    });
}