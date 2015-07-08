var i = {}; 
var funct={}; 
var fadeRate = 100; 

var w; // width of our drawing context
var h; // height of our drawing context
var c; // a canvas context to use in live coding of visuals 
var draw = function() {}; // redefined in performance, called every animation frame
var play = function(e) {}; // redefined in performance, called with events from server (i.e. /play messages from Tidal)
 
function setupVisuals() {
    // add a new canvas adjusted to display dimensions and store context for later use
    $('<canvas>').attr({id: "gcanvas"}).css({zIndex: $('canvas').length + 3}).insertBefore('#global');
    $('#global').css({zIndex: $('canvas').length + 3});
    adjustCanvasDimensions();
    c = document.getElementById('gcanvas').getContext('2d');
    // and activate our animation callback function 'tick'
    requestAnimationFrame(tick); // activate our animation callback function 'tick'
    console.log('visuals are set');
};

function adjustCanvasDimensions() {
    w = $("#global").width();
    h = $("#global").height();
    var canvas = document.getElementById("gcanvas");
    canvas.width = w;
    canvas.height = h;
}
    
function tick() {
    draw();
    $.each(funct, function(k,v) { eval(v); });
    requestAnimationFrame(tick);
}

function retick() { // useful if in livecoding an error crashes animation callback
    requestAnimationFrame(tick);
}

function clear () {c.clearRect(0,0,w,h)};

// function fade (x) {
//     if(x !="stop") setTimeout(function() {fade()},fadeRate);
//     c.beginPath();
//     c.fillStyle = "rgba(0,0,0,0.1)";	
//     c.fillRect(0,0,w,h);
//     c.closePath();
// }

