import validate from 'validate.js'
import { defaultPresenceValidator, defaultPrismaMaxLength } from './customDefaultValidators.validation.js';
import getPlant from '../apis/getPlant.api.js';


export const validatePlant = () => {
    return async (req, res, next) => {
        console.log(req.body);
        // Checks if the input location actually exists
        validate.validators.plantExists = async (value, options) => {
            return new Promise(async (resolve, reject) => {
                try{
                    await getPlant(value, options.plantFamily, options.scientificName);
                    resolve();
                }catch(err){ resolve('^Plant not found.'); }
            });
        }
        try{
            await validate.async(req.body, {
                plantName: {
                    ...defaultPresenceValidator,
                    plantExists: {
                        plantFamily: req.body.plantFamily,
                        scientificName: req.body.scientificName
                    }
                }
            });
            next();
        }catch(validationErrors){
            res.status(403).json({
                status: 403,
                message: 'Invalid values. Please try again.',
                validationErrors: validationErrors
            });
        }
    }
}