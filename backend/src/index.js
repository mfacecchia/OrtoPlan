import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { isLoggedIn } from './middlewares/isLoggedIn.middleware.js';
import userAuth from './routes/auth.routing.js'

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