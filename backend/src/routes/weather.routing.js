import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import getWeatherInfo from "../apis/getWeather.api.js";

export default function getWeather(app){
    app.post('/api/weather', isLoggedIn(true, false), async (req, res) => {
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
}