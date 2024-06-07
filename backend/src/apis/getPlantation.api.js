import prisma from "../../db/prisma.db.js";


export default function getPlantation(plantationID, userID){
    if(typeof plantationID !== 'number') plantationID = parseInt(plantationID) || 0;
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