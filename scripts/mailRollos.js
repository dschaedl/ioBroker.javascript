

subscribe({id: "javascript.0.rollos.mode" , change:"ne"}, function (data){
    sendRolloMail(data, "Var. Rollos mode");
 });

subscribe({id: "javascript.0.rollos.weather_mode" , change:"ne"}, function (data){
    sendRolloMail(data, "Var. Rollos weather mode");
});

//Rollos.level 0(down) 100(up)

subscribe({id: "hm-rpc.0.KEQ0811281.1.WORKING" , change:"ne"}, function (data){
    if (!getState("hm-rpc.0.KEQ0811281.1.WORKING").val) {
      sendRolloMail(data, "Rollo Ost");
    }
    }); 
subscribe({id: "hm-rpc.0.KEQ0813280.1.WORKING" , change:"ne"}, function (data){
    if (!getState("hm-rpc.0.KEQ0813280.1.WORKING").val) {
      sendRolloMail(data, "Rollo Mitte");
    }
    }); 
subscribe({id: "hm-rpc.0.KEQ0154705.1.WORKING" , change:"ne"}, function (data){
    if (!getState("hm-rpc.0.KEQ0154705.1.WORKING").val) {
      sendRolloMail(data, "Rollo West");
    }
    }); 
subscribe({id: "hm-rpc.0.KEQ0811221.1.WORKING" , change:"ne"}, function (data){
    if (!getState("hm-rpc.0.KEQ0811221.1.WORKING").val) {
      sendRolloMail(data, "Rollo Seite");
    }
    }); 
subscribe({id: "hm-rpc.0.KEQ0811198.1.WORKING" , change:"ne"}, function (data){
    if (!getState("hm-rpc.0.KEQ0811198.1.WORKING").val) {
      sendRolloMail(data, "Rollo Aussen");
    }
    }); 

// trigger for Mythenquai_Sturmwarnstufe
subscribe({id: "javascript.0.weather.mythenquai.sturmwarnung" , change:"ne"}, function (data){
    sendIt(data, "Sturmwarnung!");
});

function sendRolloMail(data, ausloeser) {
    
    var rolloOst_working = getState("hm-rpc.0.KEQ0811281.1.WORKING").val;
    var rolloMitte_working = getState("hm-rpc.0.KEQ0813280.1.WORKING").val;
    var rolloWest_working = getState("hm-rpc.0.KEQ0154705.1.WORKING").val;
    var rolloAussen_working = getState("hm-rpc.0.KEQ0811198.1.WORKING").val;
    var rolloSeite_working = getState("hm-rpc.0.KEQ0811221.1.WORKING").val;

    // only send mail if no Rollo is moving anymore
    // after one minute
    if (!rolloOst_working && !rolloMitte_working && !rolloWest_working && !rolloAussen_working && !rolloSeite_working) {
        // wait for 60s
        log("mailRollos: no rollo is moving...sending mail in 60s");
        setTimeout(function() {sendIt(data, ausloeser);}, 60000);
    }
}

function sendIt(data, ausloeser) {

  var rollosMode = getState("rollos.mode").val;
  var rollosWeatherMode = getState("rollos.weather_mode").val;
  var globalstrahlung = getState("weather.mythenquai.globalstrahlung").val;
  var lastupdated = getState("weather.mythenquai.lastupdated").val;
  var lastupdatedbefore = getState("weather.mythenquai.lastupdatedbefore").val;
  var luft = getState("weather.mythenquai.lufttemp").val;
  var niederschlag = getState("weather.mythenquai.niederschlag").val;
  var sturmwarnung = getState("weather.mythenquai.sturmwarnung").val;
  var wassertemp = getState("weather.mythenquai.wassertemp").val;
  var windboen = getState("weather.mythenquai.windboen").val;
  var windgeschw = getState("weather.mythenquai.windgeschw").val;
  var innenTemp = getState("hm-rpc.0.HEQ0355291.1.TEMPERATURE").val;
  var error = getState("weather.mythenquai.updateError").val;
  var azimuth = getState("weather.sunAzimuth").val;
  var atHome = getState("state.atHome").val;
  var forecast_rain = getState("weather.forecast.rain1h").val;
  
  var rolloOst_level = getState("hm-rpc.0.KEQ0811281.1.LEVEL").val;
  var rolloMitte_level = getState("hm-rpc.0.KEQ0813280.1.LEVEL").val;
  var rolloWest_level = getState("hm-rpc.0.KEQ0154705.1.LEVEL").val;
  var rolloSeite_level = getState("hm-rpc.0.KEQ0811221.1.LEVEL").val;
  var rolloAussen_level = getState("hm-rpc.0.KEQ0811198.1.LEVEL").val;

  var rolloOst_working = getState("hm-rpc.0.KEQ0811281.1.WORKING").val;
  var rolloMitte_working = getState("hm-rpc.0.KEQ0813280.1.WORKING").val;
  var rolloWest_working = getState("hm-rpc.0.KEQ0154705.1.WORKING").val;
  var rolloSeite_working = getState("hm-rpc.0.KEQ0811221.1.WORKING").val;
  var rolloAussen_working = getState("hm-rpc.0.KEQ0811198.1.WORKING").val;
  
  var mail_body = "Sonnenrollos gesetzt auf: " + rollosMode + " / weather: " + rollosWeatherMode
  + "\nRollo Ost " + rolloOst_level + ""
  + "\nRollo Mitte " + rolloMitte_level + ""
  + "\nRollo West " + rolloWest_level + ""
  + "\nRollo Seite " + rolloSeite_level + ""
  + "\nRollo Aussen " + rolloAussen_level + ""
  + "\n-- 100 = oben; 0 = unten --"
  + "\nAuslöser: " + ausloeser + ""
  + "\nTemp Innen: " + innenTemp + " C°"
  + "\nMythenquai: "
  + "\n  Strahlung: " + globalstrahlung + " w/m2"
  + "\n  Niederschlag: " + niederschlag + " mm/h"
  + "\n  Windboen: " + windboen + " m/s (10min)"
  + "\n  Sturmwarnung: " + sturmwarnung + " u/min"
  + "\n  Temp: " + luft + " C°"
  + "\n  last update: " + lastupdated
  + "\n  last updated before: " + lastupdatedbefore
  + "\n  update error: " + error
  + "\n\nNiederschlag Progonose 1h: " + forecast_rain + " mm/h"
  + "\nAzimuth: " + azimuth + " (115..280)"
  + "\natHome: " + atHome;

  // only send mail if no Rollo is moving anymore
  if (!rolloOst_working && !rolloMitte_working && !rolloWest_working && !rolloAussen_working && !rolloSeite_working) {
     
      var mail_to = "homematic@daniel.schaedler.name" ;
      var mail_subject = "iobroker: Rollos - " + rollosMode + " / " + rollosWeatherMode;
    
      email({
        to: mail_to,
        subject: mail_subject,
        text: mail_body});
      
      log("mailRollos: Mail sent");
  }
}
