import fetch from 'node-fetch'

export default function getWeatherInfo(locationLat, locationLong){
    /*
        * Obtains forecast for the next 14 days for the selected location
        * Location is defined through `location.lat` and `location.long` Object's fields
    */
    return new Promise(async (resolve, reject) => {
        try{
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locationLat}&longitude=${locationLong}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max&forecast_days=14`, {
                method: 'GET'
            });
            if(res.status === 400){
                reject("Forecast temporarily not available for this location. Please try again later.")
                return;
            }
            const jsonRes = await res.json();;
            const forecastData = filterWeatherData(jsonRes.daily);
            forecastData.forEach(weather => {
                weather.weatherIcon = defineWeatherIcon(weather.code);
            });
            resolve(forecastData);
        }catch(err){
            reject('Unknown error. Please reload the page and try again.');
        }
    });
}


function filterWeatherData(weatherApiData){
    const forecastData = [];
    for(let i = 0; i < weatherApiData.time.length; i++){
        forecastData.push({
            date: weatherApiData.time[i],
            code: weatherApiData.weather_code[i],
            minTemp: weatherApiData.temperature_2m_min[i],
            maxTemp: weatherApiData.temperature_2m_max[i],
            rainMm: weatherApiData.precipitation_sum[i],
            rainTime: weatherApiData.precipitation_hours[i],
            rainProbability: weatherApiData.precipitation_probability_max[i],
            windSpeed: weatherApiData.wind_speed_10m_max[i],
            sunrise: weatherApiData.sunrise[i],
            sundown: weatherApiData.sunset[i]
        });
    }
    return forecastData;
}

function defineWeatherIcon(weatherCode){
    /*
        * Returns the corresponding weather icon to the API returned weather code
    */
    const weatherCodes = [
        {
            codes: [0],
            icon: 'sun.svg'
        },
        {
            codes: [1, 2, 3, 45, 48],
            icon: 'cloudy.svg'
        },
        {
            codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67],
            icon: 'rain.svg'
        },
        {
            codes: [71, 73, 75, 77],
            icon: 'snow.svg'
        },
        {
            codes: [80, 81, 82, 85, 86, 95, 96, 99],
            icon: 'thunderstorm.svg'
        }
    ];
    return weatherCodes.find(weatherCodeObj => {
        return weatherCodeObj.codes.includes(weatherCode);
    }).icon;
}