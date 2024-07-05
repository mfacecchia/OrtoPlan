import { validateJWT } from '../auth/jwt.auth.js';
import decodeToken from '../jwt/decode.jwt.js';
import 'dotenv/config';
import { findUser } from '../apis/findUser.api.js';
import { generateEmailVerificationLink, sendVerificationMail, removeVerificationMessage, verifyEmailAddress } from '../auth/verificateEmailAddress.auth.js';


export default function emailAddressVerification(app){
    app.post('/user/verify', async (req, res) => {
        const token = req.body.verificationToken;
        try{
            await validateJWT(token, process.env.JWT_USER_ACTIONS_SECRET);
        }catch(err){
            res.status(401).json({
                status: 401,
                message: "Token not found or invalid"
            });
            return;
        }
        const decodedToken = decodeToken(token, false);
        try{
            const message = await removeVerificationMessage(decodedToken.messageID);
            await verifyEmailAddress(message.email);
            res.status(200).json({
                status: 200,
                message: "Email address verified"
            });
        }catch(err){
            res.status(403).json({
                status: 403,
                message: 'Invalid token or email address not found'
            });
        }
    });

    app.post('/user/verify/generate', async (req, res) => {
        let user;
        try{
            const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
            user = await findUser(decodedToken.userID, true, false);
        }catch(err){
            res.status(404).json({
                status: 404,
                message: err.message
            });
            return;
        }
        if(user.verified){
            res.status(401).json({
                status: 401,
                message: "Email address already verified."
            });
            return;
        }
        const messageLink = await generateEmailVerificationLink(user.email, true);
        try{
            await sendVerificationMail(user.email, messageLink);
        }catch(err){
            res.status(404).json({
                status: 404,
                message: err.message
            });
            return;
        }
        res.status(201).json({
            status: 201,
            message: "Verification code sent. Check your inbox or your spam folder."
        });
    });
}