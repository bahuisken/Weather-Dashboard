//Declare Variables

var apiKeyOW = '&appid=d2dfc8fa420bccc740e2cf8acf694bb0';
var searchedCity;
var citySearchInput = document.querySelector('#city-search');
var currentBaseURL = 'https://api.openweathermap.org/data/2.5/weather?q='
var fiveDayBaseURL = 'https://api.openweathermap.org/data/2.5/forecast?q='
var uviBaseUrl = 'https://api.openweathermap.org/data/2.5/onecall?'
var units = '&units=imperial'
var searchCityLi = document.querySelectorAll('.searched-city');
var currentDate = luxon.DateTime.local().toFormat('L/d/yyyy');
var newCityCardBodyText;
//Functions
// JavaScript function that wraps everything
$(document).ready(function () {

    // Initialization Function to check if a searched City is in Local Storage
    function intit() {
        var prevSearchedCity = localStorage.getItem('lastSearchedCity')
        if (prevSearchedCity) {
            var prevSearchedCityLi = $('<li>');
            prevSearchedCityLi.attr('class', 'list-group-item searched-city');
            prevSearchedCityLi.text(prevSearchedCity);
            $('#previous-searches').append(prevSearchedCityLi);
        } else {
            return;
        }

    }

    intit();

    // Function to get current weather

    function currentWeather(city) {
        var currentApiURL = `${currentBaseURL}${city}${apiKeyOW}${units}`
        console.log("Searched City is: " + city + '\n' + currentApiURL);
        // http://openweathermap.org/img/wn/03d@2x.png
        fetch(currentApiURL)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                var newCityCard = $('<div>');
                newCityCard.attr('class', 'card mt-4');
                var newCityCardHeader = $('<p>');
                newCityCardHeader.attr('class', 'font-weight-bold px-4 current-city');
                newCityCardHeader.text(data.name + " (" + currentDate + ")");
                var newCityImg = $('<img>');
                newCityImg.attr('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
                newCityImg.attr('class', 'current-icon')
                var newCityCardBody = $('<div>');
                newCityCardBody.attr('class', 'card-body py-1');
                newCityCardBodyText = $('<p>');
                newCityCardBodyText.attr('class', 'current-city-stats')
                newCityCardBodyText.html('Temperature: ' + Math.round(data.main.temp) + '˚F<br> Humidity: ' + data.main.humidity + '%<br>Wind Speed: ' + data.wind.speed + ' MPH<br>UV Index: ');
                $('#current-forecast-holder').append(newCityCard);
                newCityCard.append(newCityCardHeader, newCityCardBody);
                newCityCardHeader.append(newCityImg);
                newCityCardBody.append(newCityCardBodyText);
                var latVal = data.coord.lat;
                var lonVal = data.coord.lon;
                console.log(latVal + ' ' + lonVal);
                return fetch(`${uviBaseUrl}lat=${latVal}&lon=${lonVal}&exclude=minutely,hourly,daily,alerts${apiKeyOW}`);

            })
            .then(function (response) {
                return response.json();

            })
            .then(function (data) {
                var uviLevel = data.current.uvi;
                var newUviSpan = $('<span>');
                if (uviLevel < 3) {
                    newUviSpan.attr('class', 'uvi-favorable')
                } else if (uviLevel > 8) {
                    newUviSpan.attr('class', 'uvi-severe')
                } else {
                    newUviSpan.attr('class', 'uvi-moderate')
                }
                newUviSpan.text(uviLevel);
                console.log(newCityCardBodyText)
                newCityCardBodyText.append(newUviSpan);
            })
    }



    function fiveDayWeather(city) {
        var fiveDayApiURL = `${fiveDayBaseURL}${city}${apiKeyOW}${units}`
        console.log("Searched City is: " + city + '\n' + fiveDayApiURL);
        fetch(fiveDayApiURL)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                console.log(data);
                var newFiveDayCard = $('<div>');
                newFiveDayCard.attr('class', 'card mt-4');
                var newFiveDayCardHeader = $('<p>');
                newFiveDayCardHeader.attr('class', 'font-weight-bold px-4 current-five-day');
                newFiveDayCardHeader.text("5 Day Forecast");
                var newFiveDayCardContainer = $('<div>');
                newFiveDayCardContainer.attr('class', 'container px-5');
                var newFiveDayCardRow = $('<div>');
                newFiveDayCardRow.attr('class', 'row row-cols-1 row-cols-md-2 row-cols-sm-1')
                $('#fiveday-forecast-holder').append(newFiveDayCard);
                newFiveDayCard.append(newFiveDayCardHeader, newFiveDayCardContainer);
                newFiveDayCardContainer.append(newFiveDayCardRow);
                for (i = 0; i < data.list.length; i += 8) {
                    var fiveDayDT = luxon.DateTime.fromSQL(data.list[i].dt_txt).toFormat('L/d/yy');
                    var dayCardCol = $('<div>')
                    dayCardCol.attr('class', 'col mx-1 mb-4 text-white bg-primary day-card-col');
                    newFiveDayCardRow.append(dayCardCol);
                    var dayCardHeader = $('<h6>');
                    dayCardHeader.attr('class', 'mt-2 text-center');
                    var dayCardImg = $('<img>');
                    dayCardImg.attr('src', 'http://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png');
                    dayCardImg.attr('class', 'five-day-icon')
                    dayCardHeader.text(fiveDayDT);
                    dayCardBodyText = $('<p>');
                    dayCardBodyText.attr('class', 'five-day-city-stats')
                    dayCardBodyText.html('TEMP: ' + Math.round(data.list[i].main.temp) + '˚F<br> HUM: ' + data.list[i].main.humidity + '%');
                    dayCardCol.append(dayCardHeader, dayCardImg, dayCardBodyText);

                }
            });



    }
    // City Search Button Event Listener
    $('#search-city-btn').on('click', function () {
        event.preventDefault();
        searchedCity = $('#city-search').val().trim();
        if (searchedCity.length > 2) {
            console.log(searchedCity);
            var newSearchCityLi = $('<li>');
            newSearchCityLi.attr('class', 'list-group-item searched-city');
            newSearchCityLi.text(searchedCity);
            $('#previous-searches').prepend(newSearchCityLi);
            $('#city-search').val('');
            localStorage.setItem('lastSearchedCity', searchedCity);
            $('#current-forecast-holder').empty();
            $('#fiveday-forecast-holder').empty();
            currentWeather(searchedCity);
            fiveDayWeather(searchedCity);
        } else {
            return;
        }
    });
    // Previously searched city event listner
    $("#previous-searches").on("click", "li", function () {
        searchedCity = $(this).text();
        $('#current-forecast-holder').empty();
        $('#fiveday-forecast-holder').empty();
        currentWeather(searchedCity);
        fiveDayWeather(searchedCity);

    });

});