import { validateJWT } from "../auth/jwt.auth.js";
import { findUser } from "../apis/findUser.api.js";
import jwt from 'jsonwebtoken'
import { isTokenBlacklisted } from "../jwt/blacklist.jwt.js";


export function isLoggedIn(strict = false, setHeaderOnValid = true, returnLastUserValues = false){
    /*
        * Checks if the user is already logged in by validating the Bearer tokn passed in the request header
        * Returns a 401 Unauthorized response status if the token is nto valid, otherwise calls the `next()` middleware
        * The `strict` parameter can be set to `true` in case you want to send 401 status code if the token does not exist as well
        * The `returnLastUserValues` is used to keep track and return the values obtained from the `findUser()` function;
        * this is useful in case we want to check if the email has changed throughout an eventual user credentials update
    */
    return async (req, res, next) => {
        try{
            const token = req.headers.authorization;
            if(strict && !token) throw new Error('Invalid token.');
            if(token){
                await validateJWT(token.replace('Bearer ', ''), process.env.JWT_SECRET);
                // Obtaining the userID from the jwt decoded payload to check if the user still exists
                const decodedToken = jwt.decode(token.replace('Bearer ', ''));
                const tokenUserID = decodedToken.userID;
                const user = await findUser(tokenUserID, true, false);
                if(user.updatedAt > decodedToken.iat || await isTokenBlacklisted(token)) throw new Error();
                // NOTE: Passing the user's email verification status to the next middleware for further verifications
                req.userEmailStatus = user.verified;
                if(returnLastUserValues) req.lastUserValues = user;
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