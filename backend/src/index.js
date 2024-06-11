import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { isLoggedIn } from './middlewares/isLoggedIn.middleware.js';
import userAuth from './routes/auth.routing.js';
import forecast from './routes/weather.routing.js';
import plantations from './routes/plantations.routing.js';
import plants from './routes/plants.routing.js';
import treatments from './routes/treatments.routing.js';
import users from './routes/users.routing.js';
import notifications from './routes/notifications.routing.js';

const app = express();
app.use(cors(
    {
        // Frontend address
        origin: 'http://localhost:5500'
    }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/*', isLoggedIn(true, false), (req, res, next) => {
    next();
})

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