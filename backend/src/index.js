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
        origin: 'http://localhost:5500'
    }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/user', isLoggedIn(true, false), (req, res, next) => {
    next();
});
app.use('/user/verify/generate', limiter, (req, res, next) => {
    next();
});
// NOTE: REGEX that triggers for all routes except for the ones starting with `/api/user`
app.use(/^\/api\/(?!user).*/, isLoggedIn(true, false), isEmailVerified(false), (req, res, next) => {
    next();
});

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