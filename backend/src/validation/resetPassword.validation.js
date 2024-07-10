import validate from 'validate.js';
import { defaultPresenceValidator } from './customDefaultValidators.validation.js';


export function validatePasswordReset(){
    return async(req, res, next) => {
        const validators = {
            password: {
                ...defaultPresenceValidator
            },
            passwordVerify: {
                ...defaultPresenceValidator,
                equality: {
                    attribute: 'password',
                    message: '^Passwords do not match'
                }
            }
        };
        try{
            await validate.async(req.body, validators);
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

export function validatePasswordResetEmailInput(){
    return async(req, res, next) => {
        const validators = {
            email: {
                ...defaultPresenceValidator,
                email: true
            }
        };
        validate.validators.email.message = '^Not a valid email';    
        try{
            await validate.async(req.body, validators);
            req.body.email = req.body.email.toLowerCase();
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