var dimensions = {}; 
var screen = {}; 
var i = {}; 
var funct={}; 
var canv ={}; 
var position = {}; 
var fadeRate = 100; 
var canvasCounter=0; 

/// Set up Visual Context 
function setupVisuals() {
	// get size of the screen and set the canvas to the same size
	var g = $("#global");
	dimensions.g = g; 
	dimensions.gx=g.width();dimensions.gy=g.height(); 
	$('<canvas>').attr({id: "gcanvas"}).css({zIndex: $('canvas').length + 3}).insertBefore('#global');
 	  	$('#global').css({zIndex: $('canvas').length + 3}); 
 	  	dimensions.gcanvas = document.getElementById("gcanvas");
//  	  	alert(canvas0); 
			dimensions.gcanvas.width=dimensions.gx; dimensions.gcanvas.height=dimensions.gy; 
			canv.gcanvas = dimensions.gcanvas.getContext('2d'); 
	
	new JSvisual(); 
	console.log('visuals are set'); 
}; 

/// 
var JSvisual = function (){
	var self = this; 
	var tick = function () {
		$.each(funct, function(k,v) {
// 				console.log(v); 
				eval(v); 
// 				console.log(k); 		
			}); 
			requestAnimationFrame(tick); 
	};
	$('#edit1').keyup(function (event) {
       if (event.keyCode == 13 && event.shiftKey) {
			 	var e1 = $('#edit1').val(); 
			 	eval(e1);     
      }; 	  
});
 tick();
};

// CLEAR CANVAS
var clear = function() {canv.gcanvas.clearRect(0,0,dimensions.gx, dimensions.gy)}; 
// FADE CANVAS

var fade = function(x) {
	if(x=="stop"){ /// 
		canv.gcanvas.beginPath();
		canv.gcanvas.fillStyle = "rgba(255,255,255,0.1)";	
		canv.gcanvas.fillRect(0,0,dimensions.gx, dimensions.gy);
		canv.gcanvas.closePath(); 
		} else {
		canv.gcanvas.beginPath();
		canv.gcanvas.fillStyle = "rgba(255,255,255,0.1)";	
		canv.gcanvas.fillRect(0,0,dimensions.gx, dimensions.gy);
		canv.gcanvas.closePath(); 
		setTimeout(function() {fade()}, fadeRate)
		}
	};

	
/// Circle 
var drawCircle = function(name, colour,lineWidth) {
	if(lineWidth == null) {lineWidth=0.5};
	if(colour == null) {colour="black"};
	if(name == null) {name = 'empty'};
	var lw = lineWidth;
		if ((name in funct) == true) {
			console.log("Already a function "+ name); 
			if(colour == "stop") {delete funct[name]} 
				else  {funct[name] ="drawCircle0('"+name+ "',"+"'"+colour+"'"+","+ lw+")"};
			} 
			else {console.log("New function");
				var dc = new drawCircle0(name,colour,lw); 
				funct[name] = "drawCircle0('"+name+ "',"+"'"+colour+"'"+","+ lw+")"; 
				}; 					
};

var drawCircle0 = function(name,colour,lineWidth){
	var position = {x:Math.random()*dimensions.gx, y:dimensions.gy*Math.random()}; 
	canv.gcanvas.beginPath(); 
	canv.gcanvas.arc(
		position.x,
		position.y,  
		50*Math.random(),	0,	2*Math.PI
							);
	canv.gcanvas.lineWidth=lineWidth; 
	canv.gcanvas.strokeStyle = colour;
	canv.gcanvas.stroke();
	canv.gcanvas.closePath();  

};
 
 
 
 var drawLine = function(name, colour,lineWidth) {
	//  alert('line'); 
	if(lineWidth == null) {lineWidth=0.5};
	if(colour == null) {colour="black"};
	if(name == null) {name = 'empty'};
	var lw = lineWidth;
		if ((name in funct) == true) {
		console.log("Already a function "+ name); 
			if(colour == "stop") {delete funct[name]} 
				else  {funct[name] ="drawLine0(funct."+name+ ","+"'"+colour+"'"+","+ lw+")"};
			} 
			else {console.log("New function");
				var dc = new drawLine0(name,colour,lw); 
				funct[name] = "drawLine0(funct."+name+ ","+"'"+colour+"'"+","+ lw+")"; 
				}; 					
};

var drawLine0 = function(name, colour,lineWidth){
	var position = {x:Math.random()*dimensions.gx, y:dimensions.gy*Math.random(), 
	x0:Math.random()*dimensions.gx, y0:dimensions.gy*Math.random() }; 
	canv.gcanvas.beginPath(); 
	canv.gcanvas.moveTo(position.x,position.y); 
	canv.gcanvas.lineTo(position.x0,position.y0); 
	canv.gcanvas.lineWidth=lineWidth; 
	canv.gcanvas.strokeStyle = colour;
	canv.gcanvas.stroke(); 
	canv.gcanvas.closePath(); 

};



 var drawSquare = function(name, type, colour,size,lw) {
//  alert('line'); 

	if(name == null) {name = 'empty'};
	if(type == null) {type = 'solid'};
	if(colour == null) {colour="black"};
	if(size == null) {size = Math.random()*100};
	if(lw == null) {lw=0.5};
	// console.log("name: "+name +" colour: " + colour + " type: " + type + "size: " + size); 

	if ((name in funct) == true) {
 		console.log("Already a function "+ name);   
 		if(type == "stop") {delete funct[name]} 
 			else  {console.log(canv[name]);funct[name] ="drawSquare0('"+name+ "',"+"'"+type+"'"+","+"'"+colour+"'"+","+size+ "," +lw+ ")"};
 	  } 
 	  else {console.log("New function");
			i[name] = 0; 	
 	  	new drawSquare0(name,type,colour,size,lw); 
 	  	funct[name] = "drawSquare0('"+name+ "',"+"'"+type+"'"+","+"'"+colour+"'"+","+size+ ","+lw+")";
 	  	
 	  	} 					
};


		
var drawSquare0 = function(name, type, colour, size, lineWidth){
	var screen = canv.gcanvas; 
		
		if (type !== "solid") {
		screen.beginPath(); 
		screen.lineWidth = 1;  
		screen.rect(dimensions.gx/2+Math.sin(i[name])*dimensions.gx/2,dimensions.gy/2+Math.cos(3.01*i[name])*dimensions.gy/2,size, size);
		screen.lineWidth = 1; 
		screen.strokeStyle=colour;
		screen.stroke();
		screen.closePath(); 
		i[name]+=2*Math.PI/dimensions.gx; 
// 			console.log(i[name]);  

		} else {
		screen.fillStyle=colour; 
		screen.fillRect(dimensions.gx/2+Math.sin(i[name])*dimensions.gx/2,dimensions.gy/2+Math.cos(i[name])*dimensions.gy/2,size, size);	
		i[name] += 2*Math.PI/dimensions.gx*10; 
		; 
		}

};






