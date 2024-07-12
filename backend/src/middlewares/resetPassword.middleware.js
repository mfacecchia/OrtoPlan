import { validateJWT } from "../auth/jwt.auth.js";
import 'dotenv/config';
import decodeToken from "../jwt/decode.jwt.js";
import prisma from "../../db/prisma.db.js";


export default function isResetTokenValid(){
    return async (req, res, next) => {
        try{
            await validateJWT(req.body.resetToken, process.env.JWT_USER_ACTIONS_SECRET);
            const decodedToken = decodeToken(req.body.resetToken, false);
            const resetPasswordMessage = await prisma.userAction.findUnique({
                where: {
                    messageID: decodedToken.messageID
                }
            });
            req.userEmail = resetPasswordMessage.email;
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