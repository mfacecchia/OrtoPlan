import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userAuth from './routes/auth.routing.js'
import getWeatherInfo from './apis/getWeather.api.js'
import { isLoggedIn } from './middlewares/isLoggedIn.middleware.js';

const app = express();
app.use(cors(
    {
        // Frontend address
        origin: 'http://localhost:5500'
    }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/ping', (req, res) => {
    res.status(200).json({
        'status': "200 OK",
        "message": "Pong"
    });
});

app.post('/api/weather', isLoggedIn(), async (req, res) => {
    if(typeof req.body.location === undefined) res.status(400).json({
        status: "400",
        message: "Unable to process the request. Location not provided."
    });
    try{
        const forecast = await getWeatherInfo(req.body.location);
        res.status(200).json({
            status: "200",
            message: "Forecast obtained successfully",
            forecast: forecast
        });
    }catch(err){
        res.status(404).json({
            status: "404",
            message: err.message || err
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log("Listening");
});

userAuth(app);