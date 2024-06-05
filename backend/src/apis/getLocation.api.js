import prisma from "../../db/prisma.db.js";

export default function getLocation(locationName, locationCAP = undefined){
    // Defining all parameters to use as query `where` clause (location name as default and locationCAP in case `locationCAP` is passed)
    const queryParams = { locationName: { contains: locationName } }
    if(typeof locationCAP !== undefined && locationCAP !== '') queryParams.locationCAP = locationCAP
    return new Promise(async (resolve, reject) => {
        try{
            const location = await prisma.location.findFirstOrThrow({
                where: queryParams
            });
            resolve(location);
        }catch(err){
            reject('Location not found.');
        }
    });
}