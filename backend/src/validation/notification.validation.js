import validate from 'validate.js'
import { defaultPresenceValidator, defaultPrismaMaxLength } from './customDefaultValidators.validation.js';


export const validateNotification = () => {
    return async (req, res, next) => {
        const validators = {
            message: {
                ...defaultPresenceValidator,
                ...defaultPrismaMaxLength
            },
            notificationType: {
                ...defaultPresenceValidator,
                inclusion: {
                    within: ['treatment', 'weather'],
                    message: '^Should be either treatment or weather'
                }
            },
            notificationIcon: {
                ...defaultPresenceValidator,
                ...defaultPrismaMaxLength
            }
        };
        try{
            await validate.async(req.body, validators);
            req.body.message = req.body.message.trim();
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