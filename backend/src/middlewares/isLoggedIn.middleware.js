import { validateJWT } from "../auth/jwt.auth.js";


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