import { validateJWT } from "../auth/jwt.auth.js";
import 'dotenv/config';


export default function isVerificationTokenValid(){
    return async (req, res, next) => {
        try{
            await validateJWT(req.body.verificationToken, process.env.JWT_USER_ACTIONS_SECRET);
            next();
        }catch(err){
            res.status(401).json({
                status: 401,
                message: "Token not found or invalid"
            });
            return;
        }
    };
}