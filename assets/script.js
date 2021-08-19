
// api key from openweather
const apiKey = "3729954dae78c02cca9f4c0c5ae74990"


// function fetchWeather(city) {
//     console.log("You searched for:" + city);
// }

// initialise variables
var cities = [];

var cityInput=document.querySelector("#city");
var cityForm=document.querySelector("#city-search-form");
var citySearch = document.querySelector("#searched-city");
var weatherContainer=document.querySelector("#current-weather");
var forecastTitle = document.querySelector("#forecast");
var fivedayContainer = document.querySelector("#fiveday");
var searchHistory = document.querySelector("#search-history");

// handles form submission
var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInput.value.trim();
    if(city){
        getCityWeather(city);
        getForecast(city);
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("Please enter a City!");
    }
    saveSearch();
    search(city);
}

// saves searches to local storage
var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

// fetch request with openweather api
var getCityWeather = function(city){
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

// function to display weather
var displayWeather = function(weather, searchCity){

   weatherContainer.textContent= "";  
   citySearch.textContent=searchCity;

   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearch.appendChild(currentDate);


   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearch.appendChild(weatherIcon);

   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   console.log(weather.main.temp.Celcius);
   temperatureEl.classList = "list-group-item"
 
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

  
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"


   weatherContainer.appendChild(temperatureEl);


   weatherContainer.appendChild(humidityEl);

 
   weatherContainer.appendChild(windSpeedEl);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   getUvIndex(lat,lon)

}


// fetch request for UV
var getUvIndex = function(lat,lon){

    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
    
        });
    });
  
}
// function to handle data from above UV request
var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <= 2){
        uvIndexValue.classList = "favorable"
    }else if(index.value > 2 && index.value <= 8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value > 8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);


    weatherContainer.appendChild(uvIndexEl);
}

// fetch request for forecast from searched city using api
var getForecast = function(city){

    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           displayForecast(data);
        });
    });
};

// function to handle data from above forecast request
var displayForecast = function(weather){
    fivedayContainer.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i = i+8 ){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

   

       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       

       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       forecastEl.appendChild(weatherIcon);

       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";

     
        forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  % Humidity";


       forecastEl.appendChild(forecastHumEl);

    
        fivedayContainer.appendChild(forecastEl);
    }

}

// search/history
var search = function(search){
 
    searchEl = document.createElement("button");
    searchEl.textContent = search;
    searchEl.classList = "d-flex w-100 btn-light border p-2";
    searchEl.setAttribute("data-city",search)
    searchEl.setAttribute("type", "submit");
    searchHistory.prepend(searchEl);
}


var searchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        getForecast(city);
    }
}

cityForm.addEventListener("submit", formSumbitHandler);
searchHistory.addEventListener("click", searchHandler);