/**
 * Created by dschaedl on 27.01.2015.
 */


function checkForVariables_0() {
    log("init variables (0)", 'info');
    ['weather.mythenquai.globalstrahlung', 'weather.mythenquai.lufttemp', 'weather.mythenquai.niederschlag', 'weather.mythenquai.wassertemp',
        'weather.mythenquai.windboen', 'weather.mythenquai.windchill', 'weather.mythenquai.windgeschw', 'weather.mythenquai.lastupdated', 'weather.mythenquai.lastupdatedbefore',
        'weather.mythenquai.updateError', 'weather.mythenquai.sturmwarnung', 'weather.sunAzimuth',
        'weather.forecast.rain1h'].map( function(v) {
            if (getState(v) === null) {
                createState(v, 0);
                log('new variable created (default to 0): ' + v, 'info');
            }
        });
}

function checkForVariables_false() {
    log("init variables (false)", 'info');
    ['movements.inside', 'state.atHome'].map( function(v) {
            if (getState(v) === null) {
                createState(v, false);
                log('new variable created (default to false): ' + v, 'info');
            }
        });
}

/*
lights.mode: auto
rollos.mode: auto, up, down,
rollos.weather_mode: auto, up, down, alert
 */

function checkForVariables_auto() {
    log("init variables (auto)", 'info');
    ['lights.mode', 'rollos.mode', 'rollos.weather_mode'].map( function(v) {
            if (getState(v) === null) {
                createState(v, 'auto');
                log('new variable created (default to auto): ' + v, 'info');
            }
        });
}

checkForVariables_0();
checkForVariables_false();
checkForVariables_auto();