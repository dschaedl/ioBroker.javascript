var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var SunCalc = require("suncalc");

extractSturmwarnData(null);
extractMythenquaiData(null);

// Trigger
schedule(" */5 * * * * ", function (data) {
  extractMythenquaiData(data);
  extractSturmwarnData(data);
});

function extractMythenquaiData(data) {
  log("calling Mythenquai-Data", 'info');
  request('http://www.tecson-data.ch/zurich/mythenquai/minianz/startseite.php?position=Mythenquai', function (error, response, body) {
    if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);
        //log ("error:" + error);
        //log ("response: " + response);
        //log ("body: " + body);
    
        log("start extracting Data...", 'info');
        //var temp = $('body table tbody tr td table tbody tr td table tbody tr td table tbody tr:nth-child(15) td:nth-child(2)');
        var numbers = [];
        $('td.zeile ').filter('[width="15%"]').each(function (i, elem) {
          var txt = $(this).text();
          var number = parseFloat(txt);
          numbers.push(number);
          //log("number: " + number);
        });
    
        //for (var i = 0; i < numbers.length; i++) {
        //  log(i + " : " + numbers[i]);
        //}
    
        setIfDifferent('weather.mythenquai.globalstrahlung', "Mythenquai_Globalstrahlung", numbers[8]);
        setIfDifferent('weather.mythenquai.lufttemp', "Mythenquai_Lufttemp", numbers[0]);
        setIfDifferent('weather.mythenquai.niederschlag', "Mythenquai_Niederschlag", numbers[7]);
        setIfDifferent('weather.mythenquai.wassertemp', "Mythenquai_Wassertemp", numbers[1]);
        setIfDifferent('weather.mythenquai.windboen', "Mythenquai_Windboen", numbers[2]);
        setIfDifferent('weather.mythenquai.windchill', "Mythenquai_Windchill", numbers[5]);
        setIfDifferent('weather.mythenquai.windgeschw', "Mythenquai_Windgeschw", numbers[3]);
    
        // looking for the update-Time
        var date = $('td.kopf1 span').filter('[style="font-size:11px;"]').first().text().trim().substring(0, 16);
        log("current update-Date: " + date, 'info');
        setIfDifferent('weather.mythenquai.lastupdated', "Mythenquai_lastupdated", date);
    
        // parse the date
        var lastupdated = moment(date, 'DD.MM.YYYY HH:mm');
        //log("last updated: " + lastupdated.format());
    
        // calculate the difference to NOW
        var updatedBefore = (moment() - lastupdated) / 1000;
        log("difference: " + updatedBefore, 'info');
        setIfDifferent('weather.mythenquai.lastupdatedbefore', "Mythenquai_lastupdatedBefore", updatedBefore);
    
        // set Error if last update older than 22min
        var maxAge = 22 * 60;
        if (updatedBefore > maxAge) {
          log("UPDATE ERROR!! - last update before " + updatedBefore / 60 + " min", 'warn');
        }
        setIfDifferent('weather.mythenquai.updateError', "Mythenquai_ERROR", updatedBefore > maxAge);
        
        // position of the sun (FYI)
        var sunPosition = SunCalc.getPosition(new Date(), 47.3845, 8.4961);
        var azimuth = sunPosition.azimuth / Math.PI * 180 + 180; // 0=north
        log("azimuth of the sun: " + azimuth + "(sunPosition.azimuth: " + sunPosition.azimuth, 'info');
        setState('weather.sunAzimuth', azimuth, true);
    } else {
        // ERROR
        log("ERROR (Weather): " + error, 'warn');
        setIfDifferent('weather.mythenquai.updateError', "Mythenquai_ERROR", true);
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

function extractSturmwarnData(data) {
  log("calling zh.stwarn.ch", 'info');
  request('http://zh.stwarn.ch/', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        //log ("error:" + error);
        //log ("response: " + response);
        //log ("body: " + body);
    
        log("looking for Sturmwarnung Status...", 'info');
        var values = [];
        $('td').filter('[bgcolor="#CDDCEC"]').each(function (i, elem) {
          var value = $(this).text();
          //log("sturmwarn txt: " + value);
          values.push(value);
        });

        // log collected data
        log("Sturmwarnungen:", 'info');
        for (var i = 0; i < values.length; i = i + 2) {
          log(values[i] + ": " + values[i + 1]);
        }
    
        var untererZuerichsee = values[1].trim();
        var umin = 100;
        if ("keine Warnung" == untererZuerichsee) {
          umin = 0;
        } else if ("Sturmwarnung" == untererZuerichsee) {
          umin = 90;
        } else if ("Starkwindwarnung" == untererZuerichsee) {
          umin = 40;
        }
    
        if (getState('weather.mythenquai.sturmwarnung').val != umin) {
          setIfDifferent('weather.mythenquai.sturmwarnung', "Mythenquai_Sturmwarn", umin);
    
          var mail_to = "homematic@daniel.schaedler.name";
          var mail_subject = "ioBroker: Sturmwarnung auf " + umin;
          var mail_body = "Sturmwarnung: ";
    
          for (var i = 0; i < values.length; i = i + 2) {
            mail_body += "\n" + values[i] + ": " + values[i + 1];
          }
    
          email({
            to: mail_to,
            subject: mail_subject,
            text: mail_body
          });
        }
      } else {
          // HTTP Request Error
          log("ERROR (Sturmwarn): " + error, 'warn');
          setIfDifferent('weather.mythenquai.updateError', "Mythenquai_ERROR", true);
      }
  });
}