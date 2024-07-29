import { findUser } from '../apis/findUser.api.js';
import validate from 'validate.js';
import { defaultPresenceValidator, defaultPrismaMaxLength } from './customDefaultValidators.validation.js';
import argon2 from 'argon2';
import decodeToken from '../jwt/decode.jwt.js';


export function validateLoginSignup(isLogin = true){
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
            validate.validators.emailExists = (value) => {
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
            if(!isLogin){
                req.body.email = req.body.email.toLowerCase();
                req.body.firstName = validate.capitalize(req.body.firstName.trim());
                req.body.lastName = validate.capitalize(req.body.lastName.trim());
            }
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

export function validateUserUpdate(){
    return async(req, res, next) => {
        const validators = {};
        if(req.body.lastName){
            validators.lastName = {
                ...defaultPresenceValidator,
                ...defaultPrismaMaxLength
            };
        }
        if(req.body.firstName){
            validators.firstName = {
                ...defaultPresenceValidator,
                ...defaultPrismaMaxLength
            };
        }
        if(req.body.email){
            validators.email = {
                ...defaultPresenceValidator,
                ...defaultPrismaMaxLength,
                email: true,
                emailExists: true
            };
        }
        if(req.body.password){
            validators.oldPassword = {
                ...defaultPresenceValidator,
                oldPasswordMatches: true
            };
            validators.password = {
                ...defaultPresenceValidator,
                length: {
                    minimum: 15,
                    tooShort: '^Too short (minimum length is %{count} characters).'
                },
                isNewPasswordDifferent: true
            };
            validators.passwordVerify = {
                ...defaultPresenceValidator,
                equality: {
                    attribute: 'password',
                    message: '^Passwords do not match'
                }
            };
        };
        validate.validators.email.message = '^Not a valid email';
        // Creating a custom validator to check if the email already exists and applying it to the email validators Object
        validate.validators.emailExists = (value) => {
            return new Promise(async (resolve, reject) => {
                try{
                    await findUser(value, false, true);
                    resolve();
                }catch(err){
                    // If the user is found, then check if the corresponsing userID is different to the user who is making the actual request
                    const userID = decodeToken(req.cookies.OPSession).userID;
                    if(userID === err.userID) resolve();
                    else resolve('^Email already in use.');
                }
            });
        }
        validate.validators.oldPasswordMatches = async (value) => {
            return new Promise(async (resolve, reject) => {
                try{
                    if(await argon2.verify(req.lastUserValues.password, value)) resolve();
                    else throw new Error();
                }catch(err){
                    resolve('^Invalid password or user not found');
                }
            });
        };
        validate.validators.isNewPasswordDifferent = (value) => {
            return new Promise(async (resolve, reject) => {
                try{
                    if(await argon2.verify(req.lastUserValues.password, value)) throw new Error();
                    else resolve();
                }catch(err){
                    resolve('^Cannot be the same password');
                }
            });
        };
        try{
            await validate.async(req.body, validators);
            if(req.body.email) req.body.email = req.body.email.toLowerCase();
            if(req.body.firstName) req.body.firstName = validate.capitalize(req.body.firstName.trim());
            if(req.body.lastName) req.body.lastName = validate.capitalize(req.body.lastName.trim());
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