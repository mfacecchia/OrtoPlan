import fetch from "node-fetch";
import prisma from './prisma.db.js'


async function getLocations(){
    console.log("Obtaining locations");
    try{
        const locationsList = await fetch('https://axqvoqvbfjpaamphztgd.functions.supabase.co/comuni', {
            method: 'GET'
        });
        if(!locationsList.ok) throw new Error(`API's server responded with a status code of ${locationsList.status}`);
        const locationsListJson = await locationsList.json();
        console.log("Done.");
        console.log("Filtering locations");
        const filteredLocations = await filterLocations(locationsListJson);
        console.log("Done.");
        console.log(`${filteredLocations.length} locations successfully filtered.`);
        console.log("Adding locations to DB");
        await addToDB(filteredLocations);
        console.log("Done.");
    }catch(err){
        console.log(`Error raised => ${err}`);
    }
}

async function filterLocations(locationsList){
    const filteredLocations = [];
    for(const location of locationsList){
        filteredLocations.push({
            locationName: location.nome,
            locationCAP: location.cap,
            locationLat: location.coordinate.lat,
            locationLong: location.coordinate.lng,
        });
    }
    return filteredLocations;
}

function addToDB(locationsList){
    return new Promise(async (resolve, reject) => {
        try{
            await prisma.location.createMany({
                data: [...locationsList]
            });
            resolve(true);
        }catch(err){
            console.log(`Error raised => ${err}`);
            reject(false);
        }
    });
}

getLocations();