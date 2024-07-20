import decodeToken from '../jwt/decode.jwt.js';
import { generateEmailVerificationLink, sendVerificationMail, removeVerificationMessage, verifyEmailAddress } from '../auth/verificateEmailAddress.auth.js';
import isVerificationTokenValid from '../middlewares/emailVerification.middleware.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import isCsrfTokenValid from '../middlewares/isCsrfTokenValid.middleware.js';


export default function emailAddressVerification(app){
    app.post('/user/verify', isVerificationTokenValid(), async (req, res) => {
        const token = req.body.verificationToken;
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

    app.post('/user/verify/generate', isCsrfTokenValid(), isLoggedIn(true, false, true), async (req, res) => {
        const user = req.lastUserValues;
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