import { findUser } from '../middlewares/findUser.middleware.js';
import validate from 'validate.js'
import { defaultPresenceValidator, defaultPrismaMaxLength } from './customDefaultValidators.validation.js';


export const validateLoginSignup = (isLogin = true) => {
    /*
        * User login/signup form validation
        * The `isLogin` parameter defines if the validation should be made for login form (`isLogin = true`) or signup (`isLogin = false`)
    */
    return async(req, res, next) => {
        const validators = {
            email: {
                ...defaultPresenceValidator,
                ...defaultPrismaMaxLength,
                email: true
            },
            password: {
                ...defaultPresenceValidator
            }
        };
        // Additional validators in case of user sign-up
        if(!isLogin){
            // Creating a custom validator to check if the email already exists and applying it to the email validators Object
            validate.validators.emailExists = async (value) => {
                return new Promise(async (resolve, reject) => {
                    try{
                        await findUser(value, false, true);
                        resolve();
                    }catch(err){ resolve('^Email already in use.'); }
                });
            }
            validators.email.emailExists = {};
            validators.password.length = {
                minimum: 15,
                tooShort: '^Too short (minimum length is %{count} characters).'
            }
            validators.firstName = {
                ...defaultPresenceValidator,
                ...defaultPrismaMaxLength
            };
            validators.lastName = validators.firstName;
            validators.passwordVerify = {
                ...defaultPresenceValidator,
                equality: {
                    attribute: 'password',
                    message: '^Passwords do not match'
                }
            };
        }
        validate.validators.email.message = '^Not a valid email';    
        try{
            await validate.async(req.body, validators);
            req.body.email = req.body.email.toLowerCase();
            req.body.firstName = validate.capitalize(req.body.firstName.trim());
            req.body.lastName = validate.capitalize(req.body.lastName.trim());
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