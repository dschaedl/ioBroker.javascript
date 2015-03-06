// Trigger at 07:00

schedule("00 07 * * *", function(data) {
    setState('lights.mode', 'auto', true);
    setState('rollos.mode', 'auto', true);
    log("reset lights.mode to auto and reset Rollos.mode to auto", 'info');
});