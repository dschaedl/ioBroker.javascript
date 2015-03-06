// Trigger
schedule(" */5 * * * * ", function(data) {
  reset(data);
});

function reset(data) {
  setState("hm-rega.0.18997"/*watchdog_counter*/, 0);
  log("watchdog set to 0", 'info');
}