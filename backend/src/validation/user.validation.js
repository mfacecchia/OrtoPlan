import { findUser } from '../middlewares/findUser.middleware.js';
import validate from 'validate.js'

export const validateForm = (isLogin = true) => {
    return async(req, res, next) => {
        // Default validator for empty values, defined to simplify code readability
        const defaultPresenceValidator = { presence: { allowEmpty: false } };
        const fieldsValidations = {
            email: {
                ...defaultPresenceValidator,
                email: true
            },
            password: {
                ...defaultPresenceValidator
            }
        };
        // Additional validators in case of user sign-up
        if(!isLogin){
            // Creating a custom valdiator to check if the email already exists and applying it to the email validators Object
            validate.validators.emailExists = async (value) => {
                return new Promise(async (resolve, reject) => {
                    try{
                        await findUser(value, false, true);
                        resolve();
                    }catch(err){ resolve('^Email already in use.'); }
                });
            }
            fieldsValidations.email.emailExists = {};
            fieldsValidations.password.length = {
                minimum: 15,
                tooShort: '^Too short (minimum length is %{count} characters).'
            }
            fieldsValidations.firstName = {
                ...defaultPresenceValidator,
                length: {
                    maximum: 191,
                    tooLong: '^Too long (max length is %{count} characters).'
                },
            };
            fieldsValidations.lastName = fieldsValidations.firstName;
            fieldsValidations.passwordVerify = {
                ...defaultPresenceValidator,
                equality: {
                    attribute: 'password',
                    message: '^Passwords do not match'
                }
            };
        }
        validate.validators.email.message = '^Not a valid email';    
        try{
            await validate.async({...req.body}, {...fieldsValidations});
            next();
        }catch(validationErrors){
            res.status(403).json({
                status: 403,
                message: 'Invalid values. Please try again.',
                validationErrors: validationErrors
            })
        }
    }
}