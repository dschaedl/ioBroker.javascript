// var: Bewegung innen
subscribe({id: "javascript.0.movements.inside"/*movements.inside*/,  change: "ne"}, function(data) {
    led_1(data);
});

// var: Licht automatisch
subscribe({id: "javascript.0.lights.mode"/*lights.mode*/,  change: "ne"}, function(data) {
    led_2(data);
});

// var: at Home
subscribe({id: "javascript.0.state.atHome"/*state.atHome*/,  change: "ne"}, function(data) {
    led_3(data);
});

// Wärmedifferenz zu Bad und Schlafzimmer
subscribe({id: "hm-rpc.0.JEQ0089712.1.TEMPERATURE",  change: "ne"}, function(data) {
    led_5(data);
    led_6(data);
});

// Sensor: Feuchte Bad
subscribe({id: "hm-rpc.0.JEQ0089682.1.HUMIDITY",  change: "ne"}, function(data) {
    led_7(data);
});

// Sensor: Feuchte Schlafzimmer
subscribe({id: "hm-rpc.0.HEQ0355291.1.HUMIDITY",  change: "ne"}, function(data) {
    led_8(data);
});

// var: Rollos auf Automatisch
subscribe({id: "javascript.0.rollos.mode",  change: "ne"}, function(data) {
    led_9(data);
});


// Sensor: Temperatur innen
subscribe({id: "hm-rpc.0.HEQ0355291.1.TEMPERATURE",  change: "ne"}, function(data) {
    led_10(data);
});

// var: Mythenquai Last update
subscribe({id: "javascript.0.weather.mythenquai.lastupdated"/*weather.mythenquai.lastupdated*/,  change: "ne"}, function(data) {
    leds_weather(data);
});

// var: Sturmwarnung
subscribe({id: "javascript.0.weather.mythenquai.sturmwarnung"/*weather.mythenquai.sturmwarnung*/,  change: "ne"}, function(data) {
    led_14(data);
});

// var: update Error
subscribe({id: "javascript.0.weather.mythenquai.updateError"/*weather.mythenquai.updateError*/,  change: "ne"}, function(data) {
    led_15(data);
});

// var: remote Override
/*
subscribe({id: seVar.rollosLevel,  change: "ne"}, function(data) {
    led_16(data);
});
*/

//check all 10min
schedule(" */10 * * * * ", function(data) {
    log("10min Trigger");
    led_1();
    led_2();
    led_3();
    //led_4();
    led_5();
    led_6();
    led_7();
    led_8();
    //led_9();
    led_10();
    led_14();
    led_15();
    //led_16();
    leds_weather();
});

var OFF = 0;
var RED = 1;
var GREEN = 2;
var ORANGE = 3;

var led = {};
led[1] = "hm-rpc.0.JEQ0086977.1.LED_STATUS"; // Bewegung innen
led[2] = "hm-rpc.0.JEQ0086977.2.LED_STATUS"; // Licht automatisch
led[3] = "hm-rpc.0.JEQ0086977.3.LED_STATUS"; // atHome
led[4] = "hm-rpc.0.JEQ0086977.4.LED_STATUS";
led[5] = "hm-rpc.0.JEQ0086977.5.LED_STATUS";  // TempDiff Bad
led[6] = "hm-rpc.0.JEQ0086977.6.LED_STATUS";  // TempDiff Schlafzimmer
led[7] = "hm-rpc.0.JEQ0086977.7.LED_STATUS";  // Feuchte Bad
led[8] = "hm-rpc.0.JEQ0086977.8.LED_STATUS";  // Feuchte Schlafzimmer
led[9] = "hm-rpc.0.JEQ0086977.9.LED_STATUS";  // Rollos auf automatisch
led[10] = "hm-rpc.0.JEQ0086977.10.LED_STATUS"; // Temp. innen
led[11] = "hm-rpc.0.JEQ0086977.11.LED_STATUS"; // Sonne
led[12] = "hm-rpc.0.JEQ0086977.12.LED_STATUS"; // Wind (Boen)
led[13] = "hm-rpc.0.JEQ0086977.13.LED_STATUS"; // Regen
led[14] = "hm-rpc.0.JEQ0086977.14.LED_STATUS"; // Sturmwarnung
led[15] = "hm-rpc.0.JEQ0086977.15.LED_STATUS"; // update ERROR
led[16] = "hm-rpc.0.JEQ0086977.16.LED_STATUS"; // remote Override



function led_1(data) {
    if (getState("javascript.0.movements.inside"/*movements.inside*/).val) { // Bewegung innen
        setLedStatus(1, RED, "Bewegung innen erkannt");
    } else {
        setLedStatus(1, GREEN, "keine Bewegung innen");
    }
}

function led_2(data) {
    if (getState("javascript.0.lights.mode"/*lights.mode*/).val == "manual") { // "LichtManuell"
        setLedStatus(2, RED, "Licht auf Manuell");
    } else {
        setLedStatus(2, GREEN, "Licht auf Automatisch");
    }
}

function led_3(data) {
    if (getState("javascript.0.state.atHome"/*state.atHome*/).val) { //"atHome"
        setLedStatus(3, GREEN, "atHome = true");
    } else {
        setLedStatus(3, RED, "atHome = false");
    }
}

function led_5(data) {
    var tempAussen = getState("hm-rpc.0.JEQ0089712.1.TEMPERATURE").val;
    var tempInnen = getState("hm-rpc.0.JEQ0089682.1.TEMPERATURE").val;
    var tempMythenquai = getState("javascript.0.weather.mythenquai.lufttemp"/*weather.mythenquai.lufttemp*/).val; //"Mythenquai_Lufttemp"

    if (tempMythenquai > tempInnen) {
        setLedStatus(5, RED, "Temp Mythenquai > Temp Bad");
    } else if (tempAussen > tempInnen) {
        setLedStatus(5, ORANGE, "Temp Aussen > Temp Bad");
    } else {
        setLedStatus(5, GREEN, "Temp Bad > Temps outside");
    }
}

function led_6(data) {
    var tempAussen = getState("hm-rpc.0.JEQ0089712.1.TEMPERATURE").val;
    var tempInnen = getState("hm-rpc.0.HEQ0355291.1.TEMPERATURE").val;
    var tempMythenquai = getState("javascript.0.weather.mythenquai.lufttemp"/*weather.mythenquai.lufttemp*/).val; //"Mythenquai_Lufttemp"

    if (tempMythenquai > tempInnen) {
        setLedStatus(6, RED, "Temp Mythenquai > Temp Schlafzimmer");
    } else if (tempAussen > tempInnen) {
        setLedStatus(6, ORANGE, "Temp Aussen > Temp Schlafzimmer");
    } else {
        setLedStatus(6, GREEN, "Temp Schlafzimmer > Temps outside");
    }
}


function led_7(data) {
    if (getState("hm-rpc.0.JEQ0089682.1.HUMIDITY").val > 0.5) {
        setLedStatus(7, GREEN, "Luftfeuchte im Bad > 50%");
    } else if (getState("hm-rpc.0.JEQ0089682.1.HUMIDITY").val > 0.4) {
        setLedStatus(7, ORANGE, "Luftfeuchte im Bad zwischen 40% und 50%");
    } else {
        setLedStatus(7, RED, "Luftfeuchte im Bad < 40%");
    }
}

function led_8(data) {
    if (getState("hm-rpc.0.HEQ0355291.1.HUMIDITY").val > 0.5) {
        setLedStatus(8, GREEN, "Luftfeuchte im Schlafzimmer > 50%");
    } else if (getState("hm-rpc.0.HEQ0355291.1.HUMIDITY").val > 0.4) {
        setLedStatus(8, ORANGE, "Luftfeuchte im Schlafzimmer zwischen 40% und 50%");
    } else {
        setLedStatus(8, RED, "Luftfeuchte im Schlafzimmer < 40%");
    }
}

// Sonnenrollos mode
function led_9(data) {
    if (getState("javascript.0.rollos.mode").val == 'manual') {
        setLedStatus(9, RED, "Rollos auf Manuell");
    } else {
        setLedStatus(9, GREEN, "Rollos auf Automatisch");
    }
}

function led_10(data) {
    if (getState("hm-rpc.0.HEQ0355291.1.TEMPERATURE").val > getState('const.trigger.rollo.down.temp').val) {
        setLedStatus(10, GREEN, "Temperatur im Schlafzimmer > 25 °C");
    } else if (getState("hm-rpc.0.HEQ0355291.1.TEMPERATURE").val > 22) {
        setLedStatus(10, ORANGE, "Temperatur im Schlafzimmer zwischen 22 und 25 °C");
    } else {
        setLedStatus(10, RED, "Temperatur im Schlafzimmer < 22 °C");
    }
}


function leds_weather(data) {
    // Sonne
    if (getState("javascript.0.weather.mythenquai.globalstrahlung").val > getState('const.trigger.rollo.down.sun').val) {
        setLedStatus(11, GREEN, "Strahlung > " + getState('const.trigger.rollo.down.sun').val + " w/m2");
    } else if (getState("javascript.0.weather.mythenquai.globalstrahlung").val > getState('const.trigger.rollo.up.sun').val) {
        setLedStatus(11, ORANGE, "Strahlung zwischen " + getState('const.trigger.rollo.up.sun').val + " und " + getState('const.trigger.rollo.down.sun').val + " w/m2");
    } else {
        setLedStatus(11, RED, "Strahlung < 150 w/m2");
    }

    // Windboen
    if (getState("javascript.0.weather.mythenquai.windboen").val > getState('const.trigger.rollo.up.wind').val) {
        setLedStatus(12, RED, "Windböen > 8 m/s");
    } else if (getState("javascript.0.weather.mythenquai.windboen").val > getState('const.trigger.rollo.down.wind').val) {
        setLedStatus(12, ORANGE, "Windböen zwischen 6 und 8 m/s");
    } else {
        setLedStatus(12, GREEN, "Windboen < 5 m/s");
    }

    // Regen
    if (getState("javascript.0.weather.mythenquai.niederschlag").val > getState('const.trigger.rollo.up.rain').val) {
        setLedStatus(13, RED, "Regen > 0.5 mm");
    } else if (getState("javascript.0.weather.forecast.rain1h").val > 0) {
        setLedStatus(13, ORANGE, "Regen Prognose > 0mm");
    } else {
        setLedStatus(13, GREEN, "kein Regen (0 mm)");
    }
}


function led_14(data) {
    if (getState("javascript.0.weather.mythenquai.sturmwarnung").val > 80) {
        setLedStatus(14, RED, "Zürichsee: Sturmwarnung (90)");
    } else if (getState("javascript.0.weather.mythenquai.sturmwarnung").val > 30) {
        setLedStatus(14, ORANGE, "Zürichsee: Starkwindwarnung (40)");
    } else {
        setLedStatus(14, GREEN, "Zürichsee: keine Sturmwarnung");
    }
}

function led_15(data) {
    if (getState("javascript.0.weather.mythenquai.updateError").val) {
        setLedStatus(15, RED, "ERROR: updatefehler bei Mythenquai-Daten");
    } else {
        setLedStatus(15, GREEN, "Mythenquai: Update erfolgreich");
    }
}

/*
function led_16(data) {
    if (getState(seVar.rollosLevel) === "auto") {
        setLedStatus(16, GREEN, "Rollos Level: Auto");
    } else if (getState(seVar.rollosLevel) == "up") {
        setLedStatus(16, ORANGE, "Rollos Level: up");
    } else {
        setLedStatus(16, RED, "Rollos Level: down");
    }
}
*/


function setLedStatus(ledId, status, message) {
    setState(led[ledId], status);
    log("LED_" + ledId + ": " + status + "  -- " + message, 'info');
}

//update all LEDs on (re)start of script-engine
led_1();
led_2();
led_3();
//led_4();
led_5();
led_6();
led_7();
led_8();
//led_9();
led_10();
led_14();
led_15();
//led_16();
leds_weather();

