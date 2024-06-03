import { validateJWT } from "../auth/jwt.auth.js";
import { findUser } from "./findUser.middleware.js";
import jwt from 'jsonwebtoken'


export const isLoggedIn = (strict = false, setHeaderOnValid = true) => {
    /*
        * Checks if the user is already logged in by validating the Bearer tokn passed in the request header
        * Returns a 401 Unauthorized response status if the token is nto valid, otherwise calls the `next()` middleware
        * The `strict` parameter can be set to `true` in case you want to send 401 status code if the token does not exist as well
    */
    return async (req, res, next) => {
        try{
            const token = req.headers.authorization;
            if(strict && !token) throw new Error('Invalid token.');
            if(token){
                await validateJWT(token.replace('Bearer ', ''));
                // Obtaining the userID from the jwt decoded payload to check if the user still exists
                const tokenUserID = jwt.decode(token.replace('Bearer ', '')).userID;
                await findUser(tokenUserID, true, false)
                if(setHeaderOnValid){
                    res.status(200).json({
                        status: 200,
                        message: "Logged in successfully."
                    });
                    return;
                }
            }
        }catch(err){
            res.status(401).json({
                status: 401,
                message: "Token not found or invalid."
            });
            return;
        }
        next();
    }
}