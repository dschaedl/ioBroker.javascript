// Trigger for variable atHome
subscribe({id: "javascript.0.state.atHome" , change:"ne"}, function (data){
    sendMail(data);
});

//Programm_0
function sendMail(data){

    //var mail_body = "This MAil is sent by CCU.io and the state of the Rollos is: " + getState("Sonnenrollos");
    var atHome = getState("javascript.0.state.atHome").val;
    //var location_daniel = getState("hm-rega.0.16691"/*location_daniel*/);
    var bewegung_innen = getState("movements.inside").val;
    var bewegung_kueche = getState("hm-rpc.0.HEQ0227195.1.MOTION").val;
    var bewegung_eingang = getState("hm-rpc.0.JEQ0091598.1.MOTION").val;
    var location_daniel = getState("geofency.0.daniel.name").val + ": " + getState("geofency.0.daniel.entry").val;

    var mail_to = "homematic@daniel.schaedler.name" ;
    var mail_subject = "ioBroker: atHome " + atHome ;

    var mail_body = "atHome: " + atHome
    //    + "\nDaniel: " + location_daniel
        + "\nBewegung Küche: " + bewegung_kueche
        + "\nBewegung Eingang: " + bewegung_eingang
        + "\nBewegung innen: " + bewegung_innen
        + "\nLocation Daniel (0): " + location_daniel;

    email({
        to: mail_to,
        subject: mail_subject,
        text: mail_body});
}

