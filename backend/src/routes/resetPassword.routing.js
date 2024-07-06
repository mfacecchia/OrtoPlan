import { validateJWT } from '../auth/jwt.auth.js';
import decodeToken from '../jwt/decode.jwt.js';
import 'dotenv/config';
import { findUser } from '../apis/findUser.api.js';
import { generatePasswordResetLink, sendPasswordResetMail, removePasswordResetMessage, updatePassword } from '../auth/resetPassword.auth.js';
import argon2 from 'argon2';


export default function passwordReset(app){
    app.put('/user/reset', async (req, res) => {
        const token = req.body.resetToken;
        try{
            await validateJWT(token, process.env.JWT_USER_ACTIONS_SECRET);
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: 401,
                message: "Token not found or invalid"
            });
            return;
        }
        const decodedToken = decodeToken(token, false);
        const newPassword = req.body.password;
        let newHashedPass;
        try{
            newHashedPass = await argon2.hash(newPassword);
        }catch(err){
            res.status(400).json({
                status: 400,
                message: "Error while processing your request. Please try again."
            })
        }
        try{
            const message = await removePasswordResetMessage(decodedToken.messageID);
            await updatePassword(message.email, newHashedPass);
            res.status(200).json({
                status: 200,
                message: "Password reset successfully."
            });
        }catch(err){
            res.status(403).json({
                status: 403,
                message: 'Invalid token or user not found'
            });
        }
    });
}