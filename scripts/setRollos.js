var SunCalc = require("suncalc");

var const_down_temp = getState("const.trigger.rollo.down.temp").val;
var const_down_sun = getState("const.trigger.rollo.down.sun").val;
var const_down_wind = getState("const.trigger.rollo.down.wind").val;
var const_up_sun = getState("const.trigger.rollo.up.sun").val;
var const_up_wind = getState("const.trigger.rollo.up.wind").val;
// *** triggers for Down ***

// tempSleepingRoom
subscribe({
    id : "hm-rpc.0.HEQ0355291.1.TEMPERATURE", // temp sleepingRoom
    change : "ne",
    valGt : const_down_temp,
    oldValLe : const_down_temp
}, function(data) {
    log("sleepingRoom-room temp just switched above limit -> ready for down");
    checkRollos(data, false);
});

// sun
subscribe({
    id : "javascript.0.weather.mythenquai.globalstrahlung",
    change : "ne",
    valGt : const_down_sun,
    oldValLe : const_down_sun
}, function(data) {
    log("sun just switched above limit -> ready for down");
    checkRollos(data, false);
});

// windgusts:
subscribe({
    id : "javascript.0.weather.mythenquai.windboen",
    change : "ne",
    valLt : const_down_wind,
    oldValGe : const_down_wind
}, function(data) {
    log("wind just switched below limit -> ready for down (new: "
    + data.newState.value + " / old: " + data.oldState.value);
    checkRollos(data, false);
});

// rain:
subscribe({
    id : "javascript.0.weather.mythenquai.niederschlag",
    change : "ne",
    valLt : 0.1,
    oldValGe : 0.1
}, function(data) {
    log("rain just switched below limit -> ready for down");
    checkRollos(data, false);
});

// storm:
subscribe({
    id : "javascript.0.weather.mythenquai.sturmwarnung",
    change : "ne",
    val : 0,
    oldValGt : 0
}, function(data) {
    log("storm warning just switched off -> ready for down");
    checkRollos(data, false);
});

// updateError:
subscribe({
    id : "javascript.0.weather.mythenquai.updateError",
    change : "ne",
    val : false,
    oldVal : true
}, function(data) {
    log("updateError just switched to 'ok' -> ready for down");
    checkRollos(data, false);
});


// *** triggers for Up ***
// tempSleeping
subscribe({
    id : "hm-rpc.0.HEQ0355291.1.TEMPERATURE", // tempseleeping
    change : "ne",
    valGt : const_down_temp,
    oldValLe : const_down_temp
}, function(data) {
    log("sleepingRoom-room temp just switched above limit -> ready for down");
    checkRollos(data, false);
});

// sun
subscribe({
    id : "javascript.0.weather.mythenquai.globalstrahlung",
    change : "ne",
    valLt : const_up_sun,
    oldValGe : const_up_sun
}, function(data) {
    log("sun just switched below limit -> going up");
    checkRollos(data, false);
});

// windgusts:
subscribe({
    id : "javascript.0.weather.mythenquai.windboen",
    change : "ne",
    valGt : const_up_wind
}, function(data) {
    log("wind is above limit -> going up! (new: "
    + data.newState.value + " / old: " + data.oldState.value);
    checkRollos(data, false);
});

// rain:
subscribe({
    id : "javascript.0.weather.mythenquai.niederschlag",
    change : "ne",
    valGt : 0.1
}, function(data) {
    log("rain is above limit -> going up!");
    checkRollos(data, false);
});

// storm:
subscribe({
    id : "javascript.0.weather.mythenquai.sturmwarnung",
    change : "ne",
    valGt : 0
}, function(data) {
    log("storm warning is on -> going up!");
    checkRollos(data, false);
});

// updateError:
subscribe({
    id : "javascript.0.weather.mythenquai.updateError",
    change : "ne",
    val : true
}, function(data) {
    log("updateError is 'NOK' -> going up!");
    checkRollos(data, false);
});

//  Check on Update
subscribe({
    id : "javascript.0.weather.mythenquai.lastupdated",
    change : "ne"
}, function(data) {
    log("Mythenquai update received");
    checkRollos(data, true);
});

// trigger for Rollos-status (manual)
//Check on Update
subscribe({
    id : "javascript.0.rollos.mode",
    change : "ne"
}, function(data) {
    log("Variable rollos.mode changed to: " + data.newState.val);
    if (data.newState.val === "up") {
        setRollos(100, 0, 10);
    } else if (data.newState.val === "down") {
        checkRollos(data, false);
    } else { //auto
        checkRollos(data, false);
    }
});

// check all 5min
//setInterval(function() {checkRollos(null, true);}, 300000);

function resetWorkingState(id) {
    if (getState(id)) {
        log("resetting working-state NOW! id: " + id);
        setState(id, false);
    }
}

// for buttons
// 12-Tasten, Button9, short
on({id: "hm-rpc.0.KEQ0121069.9.PRESS_SHORT"}, function(data) {
    log("button 9 pressed (Rollos down)", 'info');
    setState("rollos.mode", "down", true);
});
// 12-Tasten, Button10, short
on({id: "hm-rpc.0.KEQ0121069.10.PRESS_SHORT"}, function(data) {
    log("button 10 pressed (Rollos up)", 'info');
    setState("rollos.mode", "up", true);
});

function isAnyRolloMoving() {
    var rolloOst_working = getState("hm-rpc.0.KEQ0811281.1.WORKING").val;
    var rolloMitte_working = getState("hm-rpc.0.KEQ0813280.1.WORKING").val;
    var rolloWest_working = getState("hm-rpc.0.KEQ0154705.1.WORKING").val;
    var rolloAussen_working = getState("hm-rpc.0.KEQ0811198.1.WORKING").val;
    var rolloSeite_working = getState("hm-rpc.0.KEQ0811221.1.WORKING").val;


    log("onTheMove: Ost, Mitte, West, Aussen, Seite: " +
    rolloOst_working + ", " + rolloMitte_working + ", " + rolloWest_working + ", " + rolloAussen_working + ", " + rolloSeite_working);

    var isMoving = (rolloOst_working || rolloMitte_working || rolloWest_working || rolloAussen_working || rolloSeite_working);

    if (isMoving) {
        // reset all variables after 5min
        log("setting trigger to reset working state of all rollos");
        if (rolloOst_working) {
            setTimeout(function() {
                resetWorkingState("hm-rpc.0.KEQ0811281.1.WORKING");
            }, 1000*60*5);
        }
        if (rolloMitte_working) {
            setTimeout(function() {
                resetWorkingState("hm-rpc.0.KEQ0813280.1.WORKING");
            }, 1000*60*5);
        }
        if (rolloWest_working) {
            setTimeout(function() {
                resetWorkingState("hm-rpc.0.KEQ0154705.1.WORKING");
            }, 1000*60*5);
        }
        if (rolloAussen_working) {
            setTimeout(function() {
                resetWorkingState("hm-rpc.0.KEQ0811198.1.WORKING");
            }, 1000*60*5);
        }
        if (rolloSeite_working) {
            setTimeout(function() {
                resetWorkingState("hm-rpc.0.KEQ0811221.1.WORKING");
            }, 1000*60*5);
        }
    }
    return isMoving;
}

function checkRollos(data, isLazyUpdate) {

    if (getState("state.atHome") && isLazyUpdate) {
        log("atHome && LazyUpdate -> don't do anything");
    } else {
        log("checking if we can lower/rise the rollos");

        var tempSleeping = getState("hm-rpc.0.HEQ0355291.1.TEMPERATURE").val;
        var sun = getState("weather.mythenquai.globalstrahlung").val;
        var windgusts = getState("weather.mythenquai.windboen").val;
        var rain = getState("weather.mythenquai.niederschlag").val;
        var forecast_rain = getState("weather.forecast.rain1h").val;
        var stormwarn = getState("weather.mythenquai.sturmwarnung").val;
        var rollosLevel = getState("rollos.mode").val;
        var rollosWeatherLevel = getState("rollos.weather_mode").val;
        var updateError = getState("weather.mythenquai.updateError").val;

        //var sunPosition = SunCalc.getPosition(new Date(), 47.3845, 8.4961);
        var azimuth = getState("weather.sunAzimuth").val;

        log("tempSleeping: " + tempSleeping + " >? " + getState("const.trigger.rollo.down.temp").val);
        log("sun: " + sun + " limit: " + getState("const.trigger.rollo.down.sun").val);
        log("wind: " + windgusts + " limit: " + getState("const.trigger.rollo.down.wind").val);
        log("rain: " + rain);
        log("rain-forecast: " + forecast_rain);
        log("StormWarn: " + stormwarn);
        log("updateError: " + updateError);
        log("rollos.level: " + rollosLevel);
        log("rollos weather level: " + rollosWeatherLevel);
        log("azimuth of the sun: " + azimuth);// sunrise=-56 ,sunset=103

        if (tempSleeping > getState("const.trigger.rollo.down.temp").val
            && sun > getState("const.trigger.rollo.down.sun").val
            && windgusts < getState("const.trigger.rollo.down.wind").val
            && rain < 0.1 && forecast_rain < 0.1
            && stormwarn === 0 && !updateError && rollosLevel === "auto") {

            log("Rollos setting to down");
            // setting Rollos to 'ab' (false)
            setState("rollos.weather_mode", "down", true);
            setRollos(0, azimuth, 10);
        }

        // check for manual setting
        if (rollosLevel === "down"
            && windgusts < getState("const.trigger.rollo.down.wind").val
            && rain < 0.1 && stormwarn === 0 && !updateError) {
            log("Rollos setting to down (manual level set to down)");
            // setting Rollos to 'ab' (false)
            setRollos(0, azimuth, 10);
        }

        if (windgusts > getState("const.trigger.rollo.up.wind").val
            || rain > 0 || forecast_rain > 0 || stormwarn > 0 || updateError) {
            log("Rollos going up - Bad Weather");
            setState("rollos.weather_mode", "alert", true);
            // setting Rollos to 'up' (true)
            setRollos(100, azimuth, 10);
        }

        if (rollosLevel === "up") {
            log("Rollos setting to up (manual level set to up)");
            // setting Rollos to 'up' (true)
            setRollos(100, azimuth, 10);
        }


        if (sun <  getState("const.trigger.rollo.up.sun").val
            && rollosLevel === "auto") {
            log("sun not strong anymore. setting timeout to 10 min and cheking again");
            setState("rollos.weather_mode", "up", true);
            // wait for 600s
            setTimeout(delayedRolloUp, 600000);
        }
    }
}

function delayedRolloUp() {
    var sun = getState("weather.mythenquai.globalstrahlung").val;
    var rollosLevel = getState("rollos.mode").val;

    if (sun < getState("const.trigger.rollo.up.sun").val
        && rollosLevel === "auto") {
        log("sun is still not strong -> Rollos going up");
        // setting Rollos to 'up' (true)
        setRollos(100, 0, 10);
    }
}

function setRollos(state, azimuth) {
    if (isAnyRolloMoving()) {
        log("Rollo is on the move... no action")
    } else {
        log("setting Sonnenrollos to:" + state + "  -- help: 0(down) 1(up)");

        // for south-side
        if (azimuth > 115 && azimuth < 280) {
            log("south-side in sun (azimuth: " + azimuth + "). setting to: " + state);
            if (!getState("hm-rpc.0.IEQ0030083.1.STATE").val || state == 1) {
                log("door is closed -> middle rollo moves");
                setSingleRollo("hm-rpc.0.KEQ0813280.1.LEVEL", state); // if door is not open, move 'mitte'
            }
            setSingleRollo("hm-rpc.0.KEQ0811281.1.LEVEL", state); // ost
            setSingleRollo("hm-rpc.0.KEQ0154705.1.LEVEL", state); // west
            setSingleRollo("hm-rpc.0.KEQ0811198.1.LEVEL", state); // aussen
        } else {
            log("south-side not in sun. setting up");
            setSingleRollo("hm-rpc.0.KEQ0811281.1.LEVEL", 100); // ost
            setSingleRollo("hm-rpc.0.KEQ0813280.1.LEVEL", 100); // mitte
            setSingleRollo("hm-rpc.0.KEQ0154705.1.LEVEL", 100); // west
            setSingleRollo("hm-rpc.0.KEQ0811198.1.LEVEL", 100); // aussen
        }
        // side
        setSingleRollo("hm-rpc.0.KEQ0811221.1.LEVEL", state); //seite
    }
}

function setSingleRollo(id, state) {
    if (getState(id).val != state) {
        setState(id, state, true);
        log("setting rollo " + id + " to " + state + " currently on " + getState(id).val);
        enforceSingleRollo(id, state, 10);
    } else {
        log("Rollo " + id + " is in correct state (" + state +")");
    }
}

function enforceSingleRollo(id, state, tries) {
    if (getState(id).val != state && tries > 0) {
        log("setting Rollo " + id + " to: '" + state + "' has failed (current value: " + getState(id).val + ") - tries left: " + tries);
        setState(id, state);
        setTimeout(function () {
            enforceSingleRollo(id, state, tries - 1);
        }, 1000);
    }
}

