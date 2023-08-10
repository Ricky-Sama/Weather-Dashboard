const cityInput = document.querySelector(".city-input")
const searchButton = document.querySelector(".search-btn")
const apiKey = "c568031de7971de7bf91e68b42233ba1"; //API key for OpenWeatherMap

const createWeatherCard = (weatherItem) => {
    return 
}

const getWetherDetails = (cityName, lat, lon) => {
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`

    fetch(weatherApiUrl).then(res => res.json()).then(data => {

        //Filter for one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
               return uniqueForecastDays.push(forecastDate);
            }
        });

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach(weatherItem => {
            createWeatherCard(weatherItem);
        });
    }).catch(() => {
        alert("An error occured fetching the forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const geocodeApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    //Get city coordinates
    fetch(geocodeApiUrl).then(res => res.json()).then(data => {
        // if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWetherDetails( name, lat, lon);
    }).catch(() => {
        alert("An error occured!");
    
    });
      
    
    
}


searchButton.addEventListener("click", getCityCoordinates);