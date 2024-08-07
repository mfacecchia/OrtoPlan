import decodeToken from '../jwt/decode.jwt.js';
import { findUser } from '../apis/findUser.api.js';
import { generatePasswordResetLink, sendPasswordResetMail, removePasswordResetMessage, updatePassword } from '../auth/resetPassword.auth.js';
import argon2 from 'argon2';
import { validatePasswordReset, validatePasswordResetEmailInput } from '../validation/resetPassword.validation.js';
import isResetTokenValid from '../middlewares/resetPassword.middleware.js';
import isCsrfTokenValid from '../middlewares/isCsrfTokenValid.middleware.js';


export default function resetPassword(app){
    app.put('/user/reset', isResetTokenValid(), validatePasswordReset(), async (req, res) => {
        const token = req.body.resetToken;
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

    app.post('/user/reset/generate', isCsrfTokenValid(), validatePasswordResetEmailInput(), async (req, res) => {
        try{
            const user = await findUser(req.body.email, false, false);
            const messageLink = await generatePasswordResetLink(user.email, true);
            await sendPasswordResetMail(user.email, messageLink);
        }catch(err){}
        res.status(201).json({
            status: 201,
            message: "Code successfully generated. You will shortly receive an Email if the address entered is registered."
        });
    });
}