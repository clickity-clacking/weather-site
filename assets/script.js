$("#select-city").submit(function(event){
    event.preventDefault();

    city = $("input").val();
    cityLat = 0;
    cityLon = 0;

    let request = new XMLHttpRequest();
    request.open("GET", "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=97407a41ef47c0e6db4595757b8819ac")
    request.send();

    request.onload = () => {
        if(request.status === 200) {
            cityInfo = JSON.parse(request.response);
            console.log(cityInfo);
            cityLat = cityInfo[0]["lat"];
            cityLon = cityInfo[0]["lon"];
            getCurrentData(city, cityLat, cityLon);
        } else {
            console.log('error ${request.status} ${request.statusText}')
            alert("Please enter a valid city");
        }
    }


});

var getCurrentData = function(location, lat, lon){
    console.log("getting current data");

    let request = new XMLHttpRequest();
    request.open("GET", "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=97407a41ef47c0e6db4595757b8819ac")
    request.send();

    request.onload = () => {
        if(request.status === 200) {
            currentInfo = JSON.parse(request.response);

            temp = currentInfo["current"]["temp"];
            console.log(temp);

            wind = currentInfo["current"]["wind_speed"];
            console.log(wind);

            humidity= currentInfo["current"]["humidity"];
            console.log(humidity);

            uv = currentInfo["current"]["uvi"];
            console.log(uv);

            displayCurrent(location,temp,wind,humidity,uv);
            
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

            displayFiveDay(fiveDayArray);
            
        } else {
            console.log('error ${request.status} ${request.statusText}')
        }
    }
};

var displayFiveDay = function(array){
    divArray = $("[id^='0") 
    divArray.each(function(index){
        $(this).attr("class","card-body");
        $(this).val(array[index])
        console.log(array[index])
    });
}


var displayCurrent = function(location,temp,wind,humidity,uv){
    var now = moment().format('MM/DD/YYYY');
    $(".subset").append('<h2 id = "city-label"></h2>')
    $("#city-label").text(location +" ("+ now + ")"); 

    $("#city-label").append('<h3 id = "city-temp"></h2>')
    $("#city-temp").text("Temp "+ temp); 

    $("#city-temp").append('<h3 id = "city-wind"></h2>')
    $("#city-wind").text("Wind "+ wind); 

    $("#city-wind").append('<h3 id = "city-humid"></h2>')
    $("#city-humid").text("Humidity "+ humidity); 

    $("#city-humid").append('<h3 id = "city-uv"></h2>')
    $("#city-uv").text("UV Index "+ uv); 

};



