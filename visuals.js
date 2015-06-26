var dimensions = {}; 
var funct={}; 
var position = {}; 
var fadeRate = 100; 

/// Set up Visual Context 
function setupVisuals() {

// get size of the screen and set the canvas to the same size
	var g = $("#global");
	dimensions.g = g; 
	dimensions.gx=g.width();dimensions.gy=g.height(); 
	var canvas = document.getElementById('canvas');
	canvas.width=dimensions.gx; canvas.height=dimensions.gy;  
	dimensions.canvas = canvas; 
	
	// get the canvas context to access draw functions
	var screen = canvas.getContext('2d'); 
	dimensions.screen=screen; 
 
	
	new JSvisual("canvas", screen); 
	console.log('visuals are set'); 
}; 


var JSvisual = function (canvasId, screen){
	 
	var self = this; 
	var tick = function () {
		$.each(funct, function(k,v) {
// 				console.log(v); 
				eval(v)
			}); 
			requestAnimationFrame(tick); 
	};
	$('#edit1').keyup(function (event, screen) {
       if (event.keyCode == 13 && event.shiftKey) {
			 	var e1 = $('#edit1').val(); 
			 	eval(e1);     
      }; 
			  
});
 tick();
};

	var clear = function() {dimensions.screen.clearRect(0,0,dimensions.gx, dimensions.gy)}; 
	var fade = function() {
		dimensions.screen.beginPath();
		dimensions.screen.fillStyle = "rgba(255,255,255,0.1)";	
		dimensions.screen.fillRect(0,0,dimensions.gx, dimensions.gy);
		dimensions.screen.closePath(); 
		setTimeout(function() {fade()}, fadeRate)
	};
	
	
var t = 0; 
var counter = 0; 
var colours = ["red","orange","yellow","green","blue","purple"];
var cc = 0; 

var drawCircle = function(name, colour,lineWidth) {
if(lineWidth == null) {lineWidth=0.5};
if(colour == null) {colour="black"};
if(name == null) {name = 'empty'};
var lw = lineWidth;
	if ((name in funct) == true) {
 	console.log("Already a function "+ name); 
 		if(colour == "stop") {delete funct[name]} 
 			else  {funct[name] ="drawCircle0(funct."+name+ ","+"'"+colour+"'"+","+ lw+")"};
 	  } 
 	  else {console.log("Not a function");var dc = new drawCircle0(name,colour,lw); funct[name] = "drawCircle0(funct."+name+ ","+"'"+colour+"'"+","+ lw+")"; console.log(funct[name])}; 					
};

var drawCircle0 = function(name,colour,lineWidth){
//  dimensions.screen.clearRect(0,0,dimensions.gx,dimensions.gy);
	var position = {x:Math.random()*dimensions.gx, y:dimensions.gy*Math.random()}; 
	dimensions.screen.beginPath(); 
	dimensions.screen.arc(
	position.x,
	position.y,  
	50*Math.random(),	0,	2*Math.PI
							);
		dimensions.screen.lineWidth=lineWidth; 
		dimensions.screen.strokeStyle = colour;
		dimensions.screen.stroke(); 

};
 






