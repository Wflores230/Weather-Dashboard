var inputEl = $("#zip-code");
var searchEl = $("#search-button");
var searchHisEl = $("#search-history")
var nameEL = $("#city-name");
var currentTempEl = $("#temperature");
var currentHumidityEl = $("#humidity");
var currentWindEl = $("#wind-speed");
var currentUVEl = $("#UV-index");
var APIKey = "3fc4263be7623c5721ab2d2f40e1f829";

var searchHis = [];

console.log(searchHis)

function weatherInfo(cityName) {
    var locQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    fetch(locQueryURL)

    .then(function (response){
        if(!response.ok){
            alert("Can't get weather information, please eneter valid city.");
            throw response.json()
        }
        return response.json();
    })
    .then(function (locRes){
        console.log(locRes);

        var currentTime = moment().format('MMMM Do YYYY')

        nameEL.text(locRes.name + " " +currentTime);
        console.log(nameEL.text())

        currentTempEl.text("Temperature: " + TempTrans(locRes.main.temp) + "F");
            console.log(currentTempEl);
        currentHumidityEl.text("Humidity: " + locRes.main.humidity + " %");
            console.log(currentHumidityEl);
        currentWindEl.text("Wind Speed: " + locRes.wind.speed + " MPH");
            console.log(currentWindEl);

        var latVal = locRes.coord.lat;
        var lonVal = locRes.coord.lon;
        var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latVal + "&lon=" + lonVal + "&appid=" + APIKey;
        console.log(UVQueryURL)
        fetch(UVQueryURL)
            
        .then(function (response) {
            if (!response.ok){
                throw response.json();
            }
            return response.json();
        })
            .then(function(UVRes){
                currentUVEl.removeAttr("class")
                if (UVRes.value < 3) {
                currentUVEl.addClass("UVBackgroundLow");
                } if (UVRes.value >= 3 && UVRes.value < 6) {
                currentUVEl.addClass("UVBackgroundMod");
                } if (UVRes.value >= 6 && UVRes.value < 8) {
                currentUVEl.addClass("UVBackgroundHigh");
                } if (UVRes.value >= 8 && UVRes.value < 11) {
                currentUVEl.addClass("UVBackgroundVHigh");
                } if (UVRes.value >= 11) {
                currentUVEl.addClass("UVBackgroundExtra");
                }   
                currentUVEl.empty();
                currentUVEl.append(UVRes.value);
            })
        
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
        console.log(forecastQueryURL);
        fetch(forecastQueryURL)
            
        .then(function (response) {  
            if (!response.ok){
                throw response.json();
            }
            return response.json();
        })
        .then(function(forecastRes){
            console.log(forecastRes);
            var forecastEls = $(".forecast");
            for (i = 0; i < forecastEls.length; i++){
                forecastEls[i].innerHTML = "";
                var forecastIndex = i * 8 + 4;
                console.log(forecastIndex)

                var forecastDate = document.createElement("p");
                forecastDate.setAttribute("class","mt-3 mb-0 forecast-date ");
                forecastDate.innerHTML = moment().add(i,'days').format("MMM Do YY");
                forecastEls[i].append(forecastDate);

                var forecastTemp = document.createElement("p");
                forecastTemp.innerHTML = "Temps: " + TempTrans(forecastRes.list[i].main.temp) + " F";
                forecastEls[i].append(forecastTemp);

                forecastHumi = document.createElement("p");
                forecastHumi.innerHTML = "Humi: " + forecastRes.list[i].main.humidity;
                forecastEls[i].append(forecastHumi);

                var forecastIcon = document.createElement("img");
                forecastIcon.setAttribute ("src", "https://openweathermap.org/img/wn/"+ forecastRes.list[i].weather[0].icon + "@2x.png")
                forecastEls[i].append(forecastIcon);
            }

        })
        
    })

}

function TempTrans(tempData) {
    return Math.floor((tempData - 273.15) *1.8 +32);
}

searchEl.on("click", function(){
    var searchData = inputEl[0].value;
    console.log(inputEl)
    console.log(searchData)
    weatherInfo(searchData);
    searchHis.push(searchData);
    localStorage.setItem("search", searchData);
    addHistory();
});

function addHistory(){
    searchHisEl.innerHTML = "";
    for (i = 0; i < searchHis.length; i++) {
        var historyListItem = document.createElement("input");
        historyListItem.setAttribute("type","text");
        historyListItem.setAttribute("class", "form-control d-block bg-white");
        historyListItem.setAttribute("value",searchHis[i]);
        historyListItem.addEventListener("click", function(){
            weatherInfo(historyListItem.value);
        })
    }
        console.log(searchHisEl)
        searchHisEl.append(historyListItem);
        console.log(searchHisEl)
};