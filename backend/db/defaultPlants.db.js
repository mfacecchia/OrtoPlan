import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";
import "dotenv/config";
import prisma from './prisma.db.js'


async function getPlantsInfo(){
    console.log("Obtaining plants");
    try{
        const allPlants = await fetch('https://house-plants2.p.rapidapi.com/all-lite', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'house-plants2.p.rapidapi.com'
            }
        });
        if(!allPlants.ok) throw new Error(`Plants API's server responded with a status code of ${allPlants.status}`);
        const allPlantsJson = await allPlants.json();
        console.log("Done.");
        console.log("Filtering plants");
        const filteredPlants = await filterPlants(allPlantsJson);
        console.log("Done.");
        console.log(`${filteredPlants.length} plants successfully filtered.`);
        console.log("Adding plants to DB");
        await addToDB(filteredPlants);
        console.log("Done.");
    }catch(err){
        console.log(`Error raised => ${err}`);
    }
}

async function filterPlants(plantsList){
    const filteredPlants = [];
    for(const plant of plantsList){
        const plantName = plant['Common name'];
        // Skipping if the plant has no name
        console.log(typeof plantName);
        if(!plantName) continue;
        let plantImg = '';
        try{
            plantImg = await getPlantImage(plantName);
        }catch(err){
            break;
        }
        filteredPlants.push({
            plantName: plantName[0],
            plantFamily: plant['Family'],
            plantDescription: `{"Category": "${plant['Categories']}", "Variety": "${plant['Origin']}", "Preferred Climate": "${plant['Climat']}"}`,
            scientificName: plant['Latin name'],
            imageURL: plantImg
        });
    }
    return filteredPlants;
}

function getPlantImage(plantName){
    /*
        * Obtains plant image from given plant name
        * Uses Unsplash Images API (docs here => https://unsplash.com/documentation)
    */
    console.log(`Finding image for ${plantName}`);
    return new Promise(async (resolve, reject) => {
        try{
            const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURI(plantName + ' Plant')}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Client-ID ${process.env.UNSPLASHAPI_KEY}`,
                    "Accept-Version": "v1"
                }
            });
            console.log(`Completed with ${res.status} status code.`);
            if(!res.ok) reject(res.status);
            const imageJSON = await res.json();
            resolve(imageJSON.results[0].urls.regular);
        }catch(err){
            reject(err);
        }
    });
}

function addToDB(plantsList){
    return new Promise(async (resolve, reject) => {
        try{
            await prisma.plant.createMany({
                data: [...plantsList]
            });
            resolve(true);
        }catch(err){
            console.log(`Error raised => ${err}`);
            reject(false);
        }
    });
}

getPlantsInfo();