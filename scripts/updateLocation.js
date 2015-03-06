// CCU.IO Objekte

var movementTimeobject;


subscribe({
    id : "hm-rpc.0.HEQ0227195.1.MOTION", //entrance
    change: "ne"
}, function(data) {
    setMovements(data);
});

subscribe({
    id : "hm-rpc.0.JEQ0091598.1.MOTION", //kitchen
    change: "ne"
}, function(data) {
    setMovements(data);
});

subscribe({
    id : "javascript.0.movements.inside",
    change: "ne"
}, function(data) {
    setHomeFromMovement(data);
});

subscribe({
    id : "geofency.0.daniel.entry"/*entry*/,
    change: "ne"
}, function(data) {
    setHomeFromGeofency(data);
});

function setMovements(data) {
    var motion_entrance = getState("hm-rpc.0.HEQ0227195.1.MOTION").val;
    var motion_kitchen = getState("hm-rpc.0.JEQ0091598.1.MOTION").val;

    if (motion_entrance) {
        log("movement entrance", 'info');
        setState('movements.inside', true, true);
    } else if(motion_kitchen) {
        log("movement kitchen", 'info');
        setState('movements.inside', true, true);
    } else {
        log("no movement inside", 'info');
        setState('movements.inside', false, true);
    }
    //setHomeFromMovement(data);
}

function setHomeFromMovement(data) {
    var movement = getState('movements.inside').val;
    //var location_daniel = getState(16691);

    if (movement) {
        log("movement detected. setting atHome to 'true'", 'info');
        setState('state.atHome', true, true);
        clearTimeout(movementTimeobject);
    } else {
        log("no movement...waiting for 30min to set atHome to 'false'", 'info');
        // timeout 30min
        movementTimeobject = setTimeout(noMovement, 1800000);
    }
}

function setHomeFromGeofency(data) {
    var entry = getState("geofency.0.daniel.entry").val;
    var name = getState("geofency.0.daniel.name").val;
    log("got a location update: name: " + name + " is now: " + entry, 'info');

    // nach hause
    if (anyPhoneHome()) {
        log("geofency triggered entry@home. setting atHome to 'true'", 'info');
        setState('state.atHome', true, true);
    }
}

function anyPhoneHome() {
    var entry = getState("geofency.0.daniel.entry").val;
    var name = getState("geofency.0.daniel.name").val;

    if ((name == 'Home') && (entry)) {
        log("Phone Daniel is at home", 'debug');
        return true;
    }

    log("Phone Daniel is *not* at home", 'debug');
    return false;
}

function noMovement() {
    var movement = getState('movements.inside').val;
    log("checking again for no movement (Bewegung: " + getState('movements.inside'), 'info');
    if (!movement && !anyPhoneHome()) {
        log("waited for 30min and still no movement -> setting atHome to 'false'", 'info');
        setState('state.atHome', false, true);
        configureForAbsent();
    }
}

function configureForAbsent() {
    log("setting defaults for atHome=false: Lights to auto, Rollos to auto", 'info');
    setState('lights.mode', 'auto', true);
    setState('rollos.mode', 'auto', true);
}