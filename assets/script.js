const searchInput = document.querySelector("#search-input")
const findCity = document.querySelector("#search-btn")
const listItemE1 = document.querySelector(".list-group")
const cityCard = document.querySelector("#city-container")
const saveCity = JSON.parse(localStorage.getItem(".list-group")) || [];
// "c568031de7971de7bf91e68b42233ba1"//OpenWeatherMap API key

$(document).ready(function () {

    const getWeatherInfo = function (city) {

        const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=c568031de7971de7bf91e68b42233ba1";

               // make a repo request to the url
               fetch(apiUrl).then(function (repsonse) {
                repsonse.json().then(function (data) {
                    const latitude = data.city.coord.lat
                    const longitude = data.city.coord.lon
                    return fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=c568031de7971de7bf91e68b42233ba1").then(function (uvResponse) {
                        uvResponse.json().then(function (uvData) {
                            displayWeather(data, city, uvData);
                            const capitalize = document.querySelector(".bold-city");
                            capitalize.classList.add("capitalize");
                            console.log(data, uvData)
                        })
                    })
                });
            });
        };
    

        const searchHandler = function (event) {
            event.preventDefault();
            
            const searchInput = document.querySelector("#search-input")
            const city = searchInput.value.trim();
            saveCity[saveCity.length] = city;
            clickCity(city);
    
            cityHistory(city);
            searchInput.value = "";
            localStorage.setItem(".list-group", JSON.stringify(saveCity));
            const capitalizeList = document.querySelector(".list-group-item");
            console.log(capitalizeList)
            capitalizeList.classList.add("capitalize");
        }

        const displayWeather = function (data, city, uvData) {

            // Clear Content
            document.querySelector(".weather-data").textContent = "";
            document.querySelector(".card-deck").innerHTML = "";
            const conditions = data.list[0];
            console.log(conditions)
            const currentTemp = data.list[0].main.temp;
            console.log(currentTemp)
            const currentHumid = data.list[0].main.humidity;
            console.log(currentHumid)
            const currentWind = data.list[0].wind.speed;
            console.log(currentWind)
            const currentUv = uvData.value;
            console.log(currentUv)
    
            const currentDate = moment().format("M/D/YYYY")
    
            const iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png' />"
    
            const cityLocation = document.createElement("h2")
            cityLocation.classList = "bold-city"
            cityLocation.innerHTML = city + ": " + currentDate + iconDisplay
    
    
            // Temperature
            const cityTemp = document.querySelector(".weather-data")
            const showConditions = document.createElement("h5")
            showConditions.classList = "temp"
            showConditions.innerHTML = "<h3> Temprature: " + currentTemp + "</h3>";
    
            // Humidity
            const showHumidity = document.createElement("h5")
            showHumidity.classList = "humid"
            showHumidity.innerHTML = "<h3> Humidity: " + currentHumid + "% </h3>";
    
            // Wind
            const showWind = document.createElement("h5")
            showWind.classList = "wind"
            showWind.innerHTML = "<h3> Wind Speed: " + currentWind + " MPH <h3>";
    
            // UV Index
            const uvIndex = document.createElement("h5")
            uvIndex.classList = "uvi"
            uvIndex.innerHTML = "<h3> UV Index: <span id='uvDanger'>" + currentUv + "</span></h3>"
    
    
            cityTemp.appendChild(cityLocation)
            cityTemp.appendChild(showConditions)
            cityTemp.appendChild(showHumidity)
            cityTemp.appendChild(showWind)
            cityTemp.appendChild(uvIndex)
    
            // UV Index Color
            if (currentUv >= 8.6) {
                $('#uvDanger').addClass('severe')
            } else if (currentUv >= 4 && currentUv < 8.6) {
                $('#uvDanger').addClass('moderate')
            } else {
                $('#uvDanger').addClass('favorable')
            }
    
    
            const forecastEl = document.getElementById("five-day")
            forecastEl.innerHTML = "<h2>Five Day Forecast:</h2>"
    
            // Five day forecast
            const cardDeck = document.querySelector(".card-deck")
    
    
            for (var i = 0; i < data.list.length; i += 8) {
                const fiveDay = (data.list[i])
                const dayDate = moment.unix(fiveDay.dt).format("M/D/YYYY")
                const card = document.createElement("div")
                card.classList = "card bg-primary"
                const cardBody = document.createElement("div")
                cardBody.classList = "card-body"
                const dateDisplay = "<p>" + dayDate + "</p>"
                const iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + fiveDay.weather[0].icon + "@2x.png' />"
                const tempDisplay = "<p> Temp: " + Math.floor(fiveDay.main.temp) + "</p>"
                const humidityDisplay = "<p> Humidity: " + fiveDay.main.humidity + "</p>"
                cardBody.innerHTML = dateDisplay + iconDisplay + tempDisplay + humidityDisplay
                card.appendChild(cardBody)
                cardDeck.appendChild(card)
    
            }
        }
    
        const clickCity = function (city) {
    
            if (city) {
                getWeatherInfo(city);
                searchInput.value = "";
            } else {
                alert("Please select a City")
                cityCard.prepend(historyList)
            }
    
        }
    
        const cityHistory = function (showCity) {
    
            // create list item for each city
            const historyList = document.createElement("li")
            historyList.classList = "list-group-item"
            historyList.textContent = showCity + "";
            historyList.setAttribute("style", "cursor:pointer")
            cityCard.prepend(historyList)
    
        }
    
    
        findCity.addEventListener("click", searchHandler);
        //Enter key while in search box will activate search
        searchInput.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                searchHandler(event)
            }
    
        });
        listItemE1.addEventListener("click", function (e) {
            clickCity(e.target.innerText)
        })
    })
    
        
    window.addEventListener("load", function() {
        const cityHisList = document.getElementById("city-container")
        for (i = 0; i < saveCity.length; i++) {
            var cityHis = document.createElement("li");
            
            cityHis.classList.add("list-group-item");
            cityHis.classList.add("capitalize");
            cityHis.innerHTML = saveCity[i];
            cityHisList.appendChild(cityHis)
            
        }
    
        localStorage.clear();

});