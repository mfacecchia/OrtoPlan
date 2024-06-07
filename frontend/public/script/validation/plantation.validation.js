function validatePlantation(plantationData){
    const validators = {
        plantationName: {
            ...defaultPresenceValidator,
            ...defaultMaxLength
        },
        locationName: {
            ...defaultPresenceValidator
        }
    }
    // Adding validation for location CAP field in case it's not empty
    if(plantationData.locationCAP){
        validators.locationCAP = {
            numericality: true,
            length: {
                is: 5,
                wrongLength: '^Must be 5 digits'
            }
        };
    };
    return new Promise(async (resolve, reject) => {
        try{
            await validate.async(plantationData, validators);
            // Sanitizing the input and passing it to the corresponding `req.body` Object key
            plantationData.plantationName = validate.capitalize(plantationData.plantationName.trim());
            resolve(plantationData);
        }catch(validationErrors){
            reject(validationErrors);
        }
    });
}