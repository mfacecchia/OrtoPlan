import prisma from "../../db/prisma.db.js";


export default function getPlant(plantName, plantFamily = undefined, scientificName = undefined){
    /*
        * Gets a plant from the DB located in the `plant` DB table
    */
    return new Promise(async (resolve, reject) => {
        try{
            const plant = await prisma.plant.findFirstOrThrow({
                include: {
                    plantation_plant: {
                        select: {
                            plannedTreatment: true
                        }
                    }
                },
                where: {
                    plantName: {
                        contains: plantName.trim()
                    },
                    plantFamily: {
                        contains: plantFamily !== undefined && plantFamily !== ''? plantFamily: undefined
                    },
                    scientificName: {
                        contains: scientificName !== undefined && scientificName !== ''? scientificName: undefined
                    }
                }
            });
            resolve(plant);
        }catch(err){
            reject('Plant not found');
        }
    })
}

export function getUserPlant(plantID, userID){
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