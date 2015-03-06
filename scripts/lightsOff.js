// Schlafzimmer 4t
subscribe({id: "hm-rpc.0.DEQ0009965.1.PRESS_SHORT"}, function (data){
    allOff(data);
});

// Entrance
subscribe({id: "hm-rpc.0.HEQ0361152.1.PRESS_SHORT"}, function (data){
    allOff(data);
});

// Plants
subscribe({id: "hm-rpc.0.HEQ0361568.1.PRESS_SHORT"}, function (data){
    allOff(data);
});


function allOff(data){
    var off = false;

    log("switch off HUE lights", 'info');

    setState("hue.0.Philips hue.Essen 11.on"/*Philips hue.Essen 11.on*/,off);
    setState("hue.0.Philips hue.Essen 12.on"/*Philips hue.Essen 12.on*/,off);
    setState("hue.0.Philips hue.Essen 13.on"/*Philips hue.Essen 13.on*/,off);
    setState("hue.0.Philips hue.Essen 21.on"/*Philips hue.Essen 21.on*/,off);
    setState("hue.0.Philips hue.Essen 22.on"/*Philips hue.Essen 22.on*/,off);
    setState("hue.0.Philips hue.Essen 23.on"/*Philips hue.Essen 23.on*/,off);
    setState("hue.0.Philips hue.Hänger farbig.on"/*Philips hue.Hänger farbig.on*/,off);
    setState("hue.0.Philips hue.Hänger weiss.on"/*Philips hue.Hänger weiss.on*/,off);
    setState("hue.0.Philips hue.Sofa farbig.on"/*Philips hue.Sofa farbig.on*/,off);
    setState("hue.0.Philips hue.Sofa weiss.on"/*Philips hue.Sofa weiss.on*/,off);
    setState("hue.0.Philips hue.Strip.on"/*Philips hue.Strip.on*/,off);

    // switch off LED Kugel
    log("switch off LED Kugel", 'info');
    setState("hm-rpc.0.HEQ0352987.1.LEVEL", 0);

    // christmas lights
    //setState(2015, 0);

    // switch off main-lights
    log("checking main lights", 'info');
    // Eingang
    if (getState("hm-rpc.0.KEQ0177988.2.STATE").val) {
        log("Eingang is on - switching off", 'info');
        setState("hm-rpc.0.KEQ0254657.2.ON_TIME", 1); //on_time
        setState("hm-rpc.0.KEQ0254657.2.STATE", true);
    }
    // Küche
    if (getState("hm-rpc.0.KEQ0177988.1.STATE").val) {
        log("Küche is on - switching off", 'info');
        setState("hm-rpc.0.IEQ0002673.1.ON_TIME", 1); //on_time
        setState("hm-rpc.0.IEQ0002673.1.STATE", true);
    }
    // Essen
    if (getState("hm-rpc.0.KEQ0177988.3.STATE").val) {
        log("Essen is on - switching off", 'info');
        setState("hm-rpc.0.IEQ0002722.1.ON_TIME", 1); //on_time
        setState("hm-rpc.0.IEQ0002722.1.STATE", true);
    }
    // make sure the switch is released after 10s
    setTimeout(enforceSwitchRelease, 10000);


    // set autolight off
    setState('lights.mode', 'manual', true);
}

function enforceSwitchRelease() {
    setState("hm-rpc.0.IEQ0002722.1.STATE", false);
    setState("hm-rpc.0.IEQ0002673.1.STATE", false);
    setState("hm-rpc.0.KEQ0254657.2.STATE", false);
    log("released all switches (just to be sure...)", 'info');
}