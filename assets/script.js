$("#select-city").submit(function(event){
    event.preventDefault();

    city = $("input").val();
   
    apiReq(city);
    addToList(city);

});

var apiReq = function(city){
    cityLat = 0;
    cityLon = 0;
    var data = {}

    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=97407a41ef47c0e6db4595757b8819ac")
    .then(function(response){
        var status = response["status"];
        console.log("status: "+status);
        if(status !== 200) {
            console.log('Problem: status code: ' + response.status);
            if(response.status === 400){
                alert("Please enter a valid city");
            };
            return;
        }

        response.json().then(function(data) {
            cityInfo = data[0];
            console.log("city info: "+cityInfo);
            cityLat = cityInfo["lat"];
            cityLon = cityInfo["lon"];
            getCurrentData(city, cityLat, cityLon); 
         });
    });
};
    



var getCurrentData = function(location, lat, lon){
    console.log("getting current data");

    let request = new XMLHttpRequest();
    request.open("GET", "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=97407a41ef47c0e6db4595757b8819ac")
    request.send();

    request.onload = () => {
        if(request.status === 200) {
            currentInfo = JSON.parse(request.response);

            temp = currentInfo["current"]["temp"];

            wind = currentInfo["current"]["wind_speed"];

            humidity= currentInfo["current"]["humidity"];

            uv = currentInfo["current"]["uvi"];

            now = displayCurrent(location,temp,wind,humidity,uv);
            
            dailyInfo = JSON.parse(request.response);

            var fiveDayArray = [];
            for(var i=0; i<5; i++){
                holder = dailyInfo["daily"][i];

                var day = {
                    temp:holder["temp"]["day"],
                    wind:holder["wind_speed"],
                    humidity:holder["humidity"],
                }
                fiveDayArray[i]=day;
            }
            console.log(fiveDayArray);

            displayFiveDay(fiveDayArray, now);
            
        } else {
            console.log('error ${request.status} ${request.statusText}')
        }
    }
};

var displayFiveDay = function(array, now){
    $(".cards").empty();
    console.log("Now: "+now)
    for(var i = 0; i<array.length; i++){
        const obj = array[i];
        var card = $("<div class='card col-2' style='height:18rem'></div>");
        var cardBody = $("<div class='card-body'></div>");
        var h5 = $("<h5 class='card-title'></h5>");
        h5.text(moment(now, "MM/DD/YYYY").add(i,'days').format("MM/DD/YYYY").toString());
        var p = $("<p class='card-text'></p>");
        p.text("Temp: "+ array[i].temp + "\nWind:" +array[i].wind  + "\nHumidity: "+array[i].humidity);
        cardBody.append(h5,p);
        card.append(cardBody);
        $(".cards").append(card);
    };
};


var displayCurrent = function(location,temp,wind,humidity,uv){
    var now = moment().format('MM/DD/YYYY');
    $(".subset").append('<h2 id = "city-label"></h2>')
    $("#city-label").text(location +" ("+ now + ")"); 

    $("#city-label").append('<h3 id = "city-temp"></h2>')
    $("#city-temp").text("Temp: "+ temp); 

    $("#city-temp").append('<h3 id = "city-wind"></h2>')
    $("#city-wind").text("Wind: "+ wind); 

    $("#city-wind").append('<h3 id = "city-humid"></h2>')
    $("#city-humid").text("Humidity: "+ humidity); 

    $("#city-humid").append('<h3 id = "city-uv"></h2>')
    $("#city-uv").text("UV Index: "+ uv); 

    return(now)
};



var addToList = function(city){
    var cityLi = $("<li class='cityButtonCard card'></li>");
    var cityBtn = $(`<button class='card-text cityButton' onclick='loadData(event)' value=${city}>${city}</button>`);
    cityLi.append(cityBtn);
    $('#searched-list').append(cityLi);
};

function loadData(event){
    var city = event.target.value;
    apiReq(city);
};

