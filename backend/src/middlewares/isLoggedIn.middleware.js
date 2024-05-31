import { validateJWT } from "../auth/jwt.auth.js";
import { findUser } from "./findUser.middleware.js";
import jwt from 'jsonwebtoken'


// TODO: Add parameter `strict` to throw in case the token is not passed in the authentication header
export const isLoggedIn = () => {
    return async (req, res, next) => {
        /*
            * Checks if the user is logged in by checking for token presence in the Authorization header and eventual validity
            * Otherwise checks if the request body contains email/password parameters to pass to the next middleware
        */
        try{
            const token = req.headers.authorization;
            if(token){
                await validateJWT(token.replace('Bearer ', ''));
                // Obtaining the userID from the jwt decoded payload to check if the user still exists
                const tokenUserID = jwt.decode(token.replace('Bearer ', '')).userID;
                await findUser(tokenUserID, true, false)
                res.status(200).json({
                    status: 200,
                    message: "Logged in successfully."
                });
                return;
            }
        }catch(err){
            res.status(401).json({
                status: 401,
                message: err.message || err
            });
            return;
        }
        next();
    }
}