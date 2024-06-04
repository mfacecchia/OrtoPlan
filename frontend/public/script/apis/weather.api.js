async function getWeatherInfo(plantationID){
    const res = await fetch(`${BACKEND_ADDRESS}/api/plantations`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('OPToken')}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "plantationID": plantationID
        })
    });
    if(!res.ok){
        return false;
    }
    const plantationData = await res.json();
    const weatherData = plantationData.plantations.location;
    
    const forecastRes = await fetch(`${BACKEND_ADDRESS}/api/weather`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('OPToken')}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            location: {
                lat: weatherData.locationLat,
                long: weatherData.locationLong
            }
        })
    });
    if(!forecastRes.ok){
        return false;
    }
    const forecast = await forecastRes.json();
    return forecast.forecast;
}