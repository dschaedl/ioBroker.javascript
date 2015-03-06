var SunCalc = require("suncalc");
var moment = require("moment");

// doMarkPresence(null);
// rotateLights(null);

// switch on the LED Ball at dusk
schedule({astro: "nauticalDusk"}, function() {
    if (getState("javascript.0.lights.mode").val == 'auto') {
        log("nauticalDusk -> switching on LED Ball", 'info');
        setState("hm-rpc.0.HEQ0352987.1.LEVEL", 1.0); //LED Kugel
    }
});

//switch off the lights at 23:14
schedule({hour: 23, minute: 14}, function () {
    if (getState("javascript.0.lights.mode").val == 'auto') {
        log("switching off LED Ball", 'info');
        setState("hm-rpc.0.HEQ0353228.1.LEVEL", 0); // christmas lights
        if (!getState("javascript.0.state.atHome")) {
            log("switching off play-lights", 'info');
            hueLight(21, false);
            hueLight(22, false);
            hueLight(23, false);
        }
    }
});

schedule(" */22 * * * * ", function(data) {
    doMarkPresence(data);
});

function doMarkPresence(data) {
    var sun = SunCalc.getTimes(new Date(), 47.3845, 8.4961);
    var atHome = getState("javascript.0.state.atHome"/*state.atHome*/).val;
    var lightsMode = getState("javascript.0.lights.mode"/*lights.mode*/).val;
    var now = moment();
    var dusk = moment(sun.dusk);
    var bedTime = moment().hour(22);

    if (!atHome && lightsMode == 'auto' && dusk < now && now < bedTime && now.date() === dusk.date()) {
        log("playing around with the lights", 'info');
        log("now: " + now.format(), 'debug');
        log("dusk: " + dusk.format(), 'debug');
        log("bedTime: " + bedTime.format(), 'debug');
        log("atHome: " + atHome, 'debug');
        log("lichtManuell: " + lightsMode, 'debug');
        rotateLights();
    }
}

function rotateLights() {
    var HUE_23 = 23;
    var HUE_22 = 22;
    var HUE_21 = 21;

    if (getState("hue.0.Philips hue.Essen " + HUE_23 + ".on").val) {
        // log("rotating lights to Nr22");
        hueLight(HUE_23, false);
        hueLight(HUE_22, true);
        hueLight(HUE_21, false);
    } else if (getState("hue.0.Philips hue.Essen " + HUE_22 + ".on").val) {
        // log("rotating lights to Nr21");
        hueLight(HUE_23, false);
        hueLight(HUE_22, false);
        hueLight(HUE_21, true);
    } else if (getState("hue.0.Philips hue.Essen " + HUE_21 + ".on").val) {
        // log("rotating lights to Nr23");
        hueLight(HUE_23, true);
        hueLight(HUE_22, false);
        hueLight(HUE_21, false);
    } else {
        // log("enabling all lights");
        hueLight(HUE_23, true);
        hueLight(HUE_22, true);
        hueLight(HUE_21, true);
    }
}

// use the ID of the Light name
function hueLight(id, state) {
    setState("hue.0.Philips hue.Essen " + id + ".on", state); // on [true, false]
    // log("setState(" + (id + 1) + " state: " + state);
    if (state) {
        setState("hue.0.Philips hue.Essen " + id + ".bri", 255); // .bri [0..255]
        setState("hue.0.Philips hue.Essen " + id + ".colormode", 'ct'); // colormode [hs(hue saturation;
        // ct(colortemperature)]
        setState("hue.0.Philips hue.Essen " + id + ".ct", 303); // CT colortemperature [153..500 (6500K..2000K)]
        // setState(id+3, 16232); // HUE [0..65535]
        // setState(id+4, 255); // SAT [0..255]
        //setState("hue.0.Philips hue.Essen " + id + ".on", 10); // RAMP_TIME [0..65535] (in 100ms)
        log("all Light params set!", 'debug');
    }
}