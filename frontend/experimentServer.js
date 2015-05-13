console.log("Running server software");
DEBUG = true;
var windowWidth = $(window).width();
var windowHeight = $(window).height();


// Get the id where the stimuli (both pictures) are located
var stimImage1 = $("#stimulus1");
var stimImage2 = $("#stimulus2");

$(window).bind('keypress', function(e) {
     handleKeypress(e.keyCode);
});

var connection;
var DEBUG = true;
var startTrialTime;
var responseTime;
var inInstruct = true;


function handleKeypress(key){
  if(DEBUG) console.log("Got keypress from " + key);
  if(String.fromCharCode(key) == 'q'){
    connection.send("Qq");
    showText("Quit!");
    return;
  }
  if(!inInstruct){
    responseTime = new Date().getTime();
    responseTime = responseTime - startTrialTime;
    connection.send("R," + responseTime);
  }
  // advance to next screen
  else{
    connection.send("C");
  }
}

// this is kind of complicated because by default, changing image attr
// is asynchronous, and so most of the time the image is made visible
// before it is loaded. hence the 'load' callback.
function showPics(faceimage, placeimage, opacityplace) {
  // Hide any text first
  $("#instructs").text("");
  loaded1 = false;
  loaded2 = false;
  if(stimImage1.attr("src") == faceimage)  loaded1 = true;
  if(stimImage2.attr("src") == placeimage)  loaded2 = true;
  // This is actually a race condition (do we advance to the next
  // image before the first image loads?), but should be a problem almost never
  if(loaded1 && loaded2)  $("#image-holder").css('visibility', 'visible');
  else{
    stimImage1.attr("src", faceimage);
    stimImage2.attr("src", placeimage);
    stimImage2.css("opacity", opacityplace);
    if(!loaded1){
      stimImage1.load(function(){
        $("#image-holder").css('visibility', 'visible');
      });
    }
    else
    {
      stimImage2.load(function(){
        $("#image-holder").css('visibility', 'visible');
      });
    }
  }

}

/* Hide image, display instructions */
function showText(text){
  // Hide image
  inInstruct = true;
  $("#image-holder").css('visibility', 'hidden');
  $("#instructs").text(text);
}

/* Writes below images what this trial type is for */
function setTrialType(text){
  $("#trialtype").text(text);
}

/* Hide everything */
function showBlank(){
  $("#image-holder").css('visibility', 'hidden');
  $("#instructs").text("");
}


// Tell backend to start the experiment
function initExperiment(){
  if(!$.connection){
    showText("Not connected to back end server!");
  }
  else{
    $.connection.write("init");
  }
}

/* update the opacity of image 2 */
function updateOpacity(opacity2){
  stimImage2.attr("opacity", opacity2);
}

function startTrial(image1, image2, opacity2){

  startTrialTime = new Date().getTime();
  inInstruct = false;
  showPics(image1, image2, opacity2);
}


// Let all these functions be accessible from the debugger browser,
// for easy debugging

$.experimentServer = {
  showPics: showPics,
  showText: showText,
  updateOpacity: updateOpacity
}

$(function () {
  $.showpics = showPics
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  connection = new WebSocket('ws://127.0.0.1:8885');
  $.conn = connection;
  connection.onopen = function () {
      // connection is opened and ready to use
  };

  connection.onerror = function (error) {
      // an error occurred when sending/receiving data
  };

  /* When a message is recieved from the server, look up the function
  in the instructions table and execute it (if it is a valid
  instruction) */

  connection.onmessage = function (message) {
    if(DEBUG)   console.log("Got command " + message.data);
    var args = message.data.split(",");
    // Show an instruction
    if(args[0] == 'I'){
      showText(args.slice(1).join());
    }
    else if(args[0] == 'S'){
      startTrial(args[1], args[2], args[3]);
    }
    else if(args[0] == 'T'){
      setTrialType(args.slice(1).join());
    }


  };
});
