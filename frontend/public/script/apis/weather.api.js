async function getWeatherInfo(plantationID){
    const plantationData = await getPlantationInfo(plantationID);
    if(!plantationData){
        displayError('Could not retrieve data for this plantation.', 'error');
        return;
    }
    const weatherData = plantationData.plantations.location;
    
    const res = await fetch(`${BACKEND_ADDRESS}/api/weather?lat=${weatherData.locationLat}&long=${weatherData.locationLong}`, {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        },
        credentials: 'include'
    });
    if(!res.ok){
        return false;
    }
    const forecast = await res.json();
    return forecast.forecast;
}