var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var SunCalc = require("suncalc");

getWuForecastData();

// Trigger
schedule(" */15 * * * * ", function (data) {
    getWuForecastData();
});

function getWuForecastData() {
    var url = "http://api.wunderground.com/api/7208e699cc51d19e/hourly/q/47.3845359,8.4959812.json";


    request({url: url, json: true}, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            try {
                //log("WU-Response Body: " + JSON.stringify(body.hourly_forecast[0].FCTTIME)); // Print the json response
                //var forecast = JSON.parse(body.jsonData);
                //log("version: " + body.response.version);
                setIfDifferent('weather.forecast.rain1h', "forecast_1h_rain", body.hourly_forecast[0].qpf.metric);
            } catch (error) {
                log("Could not parse Forecast-Data: " + error, 'warn');
            }
        } else {
            // ERROR
            log("Wunderground reported an error: " + error, 'warn');
            setIfDifferent('weather.forecast.rain1h', "forecast_1h_rain", 0);
        }
    });
}

function setIfDifferent(id, name, value) {
    var oldVal = getState(id);
    if (oldVal.val != value) {
        setState(id, value, true);
        log("new Value set for " + name + " (" + id + ")" + ": " + value + " / old: " + oldVal.val, 'info');
    }
}