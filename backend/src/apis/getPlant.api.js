import prisma from "../../db/prisma.db.js";


export default function getPlant(plantName = undefined, family = undefined, scientificName = undefined){
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
                    plantName: plantName,
                    plantFamily: family,
                    scientificName: scientificName
                }
            });
            resolve(plant);
        }catch(err){
            reject('Plant not found');
        }
    })
}