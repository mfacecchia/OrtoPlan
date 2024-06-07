import validate from 'validate.js'
import { defaultPresenceValidator, defaultPrismaMaxLength } from './customDefaultValidators.validation.js';
import getLocation from '../apis/getLocation.api.js';


export const validatePlantation = () => {
    return async (req, res, next) => {
        // Checks if the input location actually exists
        validate.validators.locationExists = async (value, options) => {
            return new Promise(async (resolve, reject) => {
                try{
                    await getLocation(value, options.locationCAP);
                    resolve();
                }catch(err){ resolve('^Location not found.'); }
            });
        }
        try{
            await validate.async(req.body, {
                plantationName: {
                    ...defaultPresenceValidator,
                    ...defaultPrismaMaxLength
                },
                locationName: {
                    ...defaultPresenceValidator,
                    locationExists: {
                        locationCAP: req.body.locationCAP
                    }
                },
                locationCAP: {
                    numericality: true,
                    length: {
                        is: 5,
                        wrongLength: '^Must be 5 digits'
                    }
                },
            });
            // Sanitizing the input and passing it to the corresponding `req.body` Object key
            req.body.plantationName = validate.capitalize(req.body.plantationName.trim());
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