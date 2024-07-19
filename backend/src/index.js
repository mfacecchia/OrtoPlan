import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import requestIp from 'request-ip';
import { rateLimit } from 'express-rate-limit';
import { isLoggedIn } from './middlewares/isLoggedIn.middleware.js';
import isEmailVerified from './middlewares/isEmailVerified.middleware.js';
import userAuth from './routes/auth.routing.js';
import forecast from './routes/weather.routing.js';
import plantations from './routes/plantations.routing.js';
import plants from './routes/plants.routing.js';
import treatments from './routes/treatments.routing.js';
import users from './routes/users.routing.js';
import notifications from './routes/notifications.routing.js';
import emailAddressVerification from './routes/emailVerification.routing.js';
import resetPassword from './routes/resetPassword.routing.js';


const commonNextHandler = (req, res, next) => { next(); };
const app = express();
const limiter = rateLimit({
    // NOTE: 2 mins
    windowMs: 2 * 60 * 1000,
    limit: 2,
    standardHeaders: 'draft-6',
    keyGenerator: (req, res) => { requestIp.getClientIp(req); },
    message: {
        status: 429,
        message: "Too many requests. Please try again in a few minutes if you didn't receive any email or check in the spam folder."
    }
})

app.use(cors(
    {
        // Frontend address
        origin: `${process.env.FRONTEND_ADDRESS}:${process.env.FRONTEND_PORT}`,
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
/*
    * NOTE: Executing the same middleware for all route methods except for `PUT` which uses the same MW
    * but needs it to place last user parameters in the `req` Object for further verifications
*/
app.route('/api/user')
    .get(isLoggedIn(true, false, false), commonNextHandler)
    .post(isLoggedIn(true, false, false), commonNextHandler)
    .delete(isLoggedIn(true, false, false), commonNextHandler)
    .put(isLoggedIn(true, false, true), commonNextHandler);

app.use(['/api/plantations', '/api/plants'], isLoggedIn(true, false, false), commonNextHandler);
app.route(['/api/plantations', '/api/plants'])
    .post(isEmailVerified(false), commonNextHandler)
    .put(isEmailVerified(false), commonNextHandler)
    .delete(isEmailVerified(false), commonNextHandler)

app.use('/user/verify/generate', limiter, commonNextHandler);

// NOTE: REGEX that triggers for all routes except for the ones starting with `/api/user`
app.use(/^\/api\/(?!user|plantations|plants).*/, isLoggedIn(true, false, false), isEmailVerified(false), commonNextHandler);

app.get('/ping', (req, res) => {
    res.status(200).json({
        'status': "200 OK",
        "message": "Pong"
    });
});

app.listen(process.env.PORT, () => {
    console.log("Listening");
});

userAuth(app);
forecast(app);
plantations(app);
plants(app);
treatments(app);
users(app);
notifications(app);
emailAddressVerification(app);
resetPassword(app);