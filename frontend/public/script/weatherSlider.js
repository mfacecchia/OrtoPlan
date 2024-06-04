async function addSliderElements(plantationID){
    const forecast = await getWeatherInfo(plantationID);
    if(!forecast){
        displayMessage('Weather not available for this location at the moment. Please try again later', 'error');
        return;
    }
    const widget = document.querySelector('#weatherSlider .glide__slides');
    forecast.forEach(forecastDay => {
        const weatherElement = createElement('li', undefined, ['glide__slide']);
        const sliderElement = createElement('div', undefined, ['weather']);
        const date = document.createElement('b');
        date.textContent = moment(forecastDay.date).format('DD/MM');
        sliderElement.appendChild(date);
        const img = createElement('img');
        img.src = `/assets/icons/${forecastDay.weatherIcon}`
        sliderElement.appendChild(img);
        const avgTemp = document.createElement('b');
        avgTemp.textContent = `${Math.round((forecastDay.maxTemp + forecastDay.minTemp) / 2).toFixed(2)}°C`;
        sliderElement.appendChild(avgTemp);
        weatherElement.appendChild(sliderElement);
        widget.appendChild(weatherElement);
    });
    createSlider();
}


function createSlider(){
    const weatherSlider = new Glide('#weatherSlider', {
        perView: 2,
        animationDuration: 700,
        breakpoints: {
            // Slider responsive options
        }
    });
    
    weatherSlider.mount();
}