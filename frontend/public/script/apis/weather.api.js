async function getWeatherInfo(plantationID){
    const plantationData = await getPlantationInfo(plantationID);
    if(!plantationData){
        displayError('Could not retrieve data for this plantation.', 'error');
        return;
    }
    const weatherData = plantationData.plantations.location;
    
    const res = await fetch(`${BACKEND_ADDRESS}/api/weather`, {
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
    if(!res.ok){
        return false;
    }
    const forecast = await res.json();
    return forecast.forecast;
}