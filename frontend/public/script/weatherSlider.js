async function addSliderElements(plantationID){
    const forecast = await getWeatherInfo(plantationID);
    const sliderDescription = document.querySelector('.glide > h1[role="definition"]');
    if(!forecast){
        sliderDescription.textContent = 'Weather not available';
        displayMessage('Weather not available for this location at the moment. Please try again later', 'error');
        return;
    }
    document.querySelector('#weatherSlider').removeChild(sliderDescription);
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
        perView: 4,
        animationDuration: 700,
        breakpoints: {
            640: {
                perView: 2
            },
            1566: {
                perView: 3
            }
        }
    });
    
    weatherSlider.mount();
}