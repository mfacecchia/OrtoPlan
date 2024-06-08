function validatePlant(plantData){
    const validators = {
        plantName: {
            ...defaultPresenceValidator
        }
    };
    return new Promise(async (resolve, reject) => {
        try{
            await validate.async(plantData, validators);
            // Sanitizing the input and passing it to the corresponding `req.body` Object key
            ['plantName', 'plantFamily', 'scientificName'].forEach(field => {
                plantData[field] = plantData[field].trim();
            });
            resolve(plantData);
        }catch(validationErrors){
            reject(validationErrors);
        }
    });
}