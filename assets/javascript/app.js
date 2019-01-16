// This will display the current date in the the jumbotron div
var d = moment().format('MMMM Do YYYY, h:mm:ss a');
console.log(d);

$("#current-date").prepend(d);

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBFOQoQ18oYI_f_HMfOSJhz2V7yGpgSZv0",
    authDomain: "fir-assignment-32109.firebaseapp.com",
    databaseURL: "https://fir-assignment-32109.firebaseio.com",
    projectId: "fir-assignment-32109",
    storageBucket: "",
    messagingSenderId: "102109895343"
};
firebase.initializeApp(config);

var database = firebase.database();

// Declaring the variables to be used for user inputs
var train = "";
var dest = "";
var firstTrainTime = "";
var freq = 0;

// When the submit button is clicked it adds the users information to the firebase database
$("#submit-info").on("click", function (event) {
    event.preventDefault();
    train = $("#train-input").val().trim();
    dest = $("#dest-input").val().trim();
    firstTrainTime = $("#time-input").val().trim();
    freq = $("#freq-input").val().trim();

    database.ref().push({
        train: train,
        dest: dest,
        firstTrainTime: firstTrainTime,
        freq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

// Firebase event listener .on(child_added)
database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();

    var svConvert = moment(sv.firstTrainTime, "HH:mm").subtract(1, "years");
    var svDiff = moment().diff(moment(svConvert), "minutes");
    var svRemainder = svDiff % sv.freq;
    var minutesAway = sv.freq - svRemainder;
    var nextArrival = moment().add(minutesAway, "minutes").format("LT");

    // This displays the information correctly in the table
    $("#user-input").append("<tr>" + "<th scope='row'>" +
        sv.train +
        "</th><td id='dest-display'>" + sv.dest +
        "</td><td id='freq-display'>" + sv.freq +
        "</td><td id='next-arrival'>" + nextArrival +
        "</td><td id='minutes-away'>" + minutesAway + " min" +
        "</td></tr>");

    // This throws an error message if something has gone wrong
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});