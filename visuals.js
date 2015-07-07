var dimensions = {}; 
var dt = {}; 
var parameters = {}; 
var size = {}; 
var screen = {}; 
var i = {}; 
var funct={}; 
var movefunct={}; 
var canv ={}; 
var position = {}; 
var previous = {}; 
var fadeRate = 100; 
var canvasCounter=0; 

function loop (i,  delay, funct) {
   setTimeout(function () {
			//console.log(dt);
			eval(funct);        //  your code here
			if (--i) {
				//console.log("titles")
				loop(i, delay, funct);
			}  //  decrement i and call myLoop again if i > 0
			if (i==0)console.log( funct + "  complete")
   }, delay);
};

/// SET UP VISUALIZATION CONTEXT
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
	var frame = function () {
		$.each(funct, function(k,v) {
// 				console.log(v); 
				eval(v.func); 
// 				console.log(k); 		
			}); 
			requestAnimationFrame(frame); 
	};
	$('#edit1').keyup(function (event) {
       if (event.keyCode == 13 && event.shiftKey) {
			 	var e1 = $('#edit1').val(); 
			 	eval(e1);     
      }; 	  
});
 frame();
};

// CLEAR CANVAS  ////////////////////////////////////////////////////////////////////////
var clear = function() {canv.gcanvas.clearRect(0,0,dimensions.gx, dimensions.gy)}; 

/// FADE CANVAS  ////////////////////////////////////////////////////////////////////////
var fadeCondition = 0; 
// Determine if fade function has already been evaluated
var fade = function(x){
	if(funct.fade !== "on") {
// 		console.log("turning funct.fade to on"); 
		if (x == "stop") {fadeCondition=1; delete funct.fade}
		else {
			funct.fade = "on"; 
			fadeCondition=0; 
			if(x !== null) {fadeRate = x;}; 
			fade0(); // call fade function
			console.log('fading :'+ fadeRate + " ms"); 
		} 
		} else {
			if (x == "stop") {fadeCondition=1; delete funct.fade}; 
			if (x !== null) {fadeRate = x}; 
					console.log('fading :'+ fadeRate + " ms"); 
		} 
	
}; 
/// Fade function -- has its own setTimeout function such that the fadeRate can be modified
var fade0 = function(){
	if(fadeCondition == 0) {
// 		console.log('fade0'); 
		canv.gcanvas.beginPath();
		canv.gcanvas.fillStyle = "rgba(255,255,255,0.1)";	
		canv.gcanvas.fillRect(0,0,dimensions.gx, dimensions.gy);
		canv.gcanvas.closePath(); 	
		setTimeout(function(){fade0()}, fadeRate); 
		} else {
		console.log('fading stopped'); 
		canv.gcanvas.beginPath();
		canv.gcanvas.fillStyle = "rgba(255,255,255,0.1)";	
		canv.gcanvas.fillRect(0,0,dimensions.gx, dimensions.gy);
		canv.gcanvas.closePath();
		}
}; 

/// DRAW TRAJECTORY //////////////////////////////////////////////////////////////////////
var drawPath = function(name, colour, lw ) {
	if((funct["drawpath"+name] in funct) == true) {
	console.log("Already drawing " + name + "s path"); 
	}
	else {
	funct["drawpath"+name] = {func: "drawPath0('"+name+"','"+colour+"',"+lw+")"}; 
	
// 	funct[name] = {func: "drawCircle0('"+name+ "',"+"'"+colour+"'"+","+ lw+",size."+name+".radius)", 
// 								id: name, type: drawCircle0, col: colour, line: lw}
	
	}; 
}; 
var drawPath0 = function(name, colour, lw){
		if (colour == null) {colour = "black"}; 
		if (lw == null) {lw = 0.6}; 
// 		console.log(previous[name].x + " : " + position[name].x); 

	canv.gcanvas.beginPath();
	canv.gcanvas.strokeStyle = colour;
	canv.gcanvas.lineWidth = 0.3;
	canv.gcanvas.lineJoin = "round";
// 	console.log(previous[name].x); 
	canv.gcanvas.moveTo(previous[name].x, previous[name].y);
// 	canv.gcanvas.moveTo(0, 0);
// 	console.log(position[name].x); 
	canv.gcanvas.lineTo(position[name].x, position[name].y);
	canv.gcanvas.closePath();
// 	canv.gcanvas.shadowBlur = 10;
	canv.gcanvas.stroke();
// 	previous[name] = position[name];
}; 

/// CIRCLE //////////////////////////////////////////////////////////////////////////////
var drawCircle = function(name, colour,lineWidth) {
	if(lineWidth == null) {lineWidth=0.5};
	if(colour == null) {colour="black"};
	if(name == null) {name = 'empty'};
	var lw = lineWidth;
	var prevfunc; 
		if ((name in funct) == true) {
			prevfunc  = funct[name].func; 
			if(colour == "stop") {delete funct[name]} 
			else  {funct[name] = {func: "drawCircle0('"+name+ "',"+"'"+colour+"'"+","+ lw+",size."+name+".radius)", 
								id: name, type: drawCircle0, col: colour, line: lw}};
				if(prevfunc == funct[name].func) {console.log("Already a function named "+ name + " : " +funct[name].func);}
				else {console.log("Changed function "+ name + " to " +funct[name].func);} 
			} 
			else {
				position[name] = {x: dimensions.gx/2, y: dimensions.gy/2}; 
				size[name] = {radius: "100*Math.random()"}; 
// 				console.log(position[name].x);
				var dc = new drawCircle0(name,colour,lw, size[name].radius); 
				funct[name] = {func: "drawCircle0('"+name+ "',"+"'"+colour+"'"+","+ lw+",size."+name+".radius)", 
								id: name, type: drawCircle0, col: colour, line: lw}; 
				console.log("New function :" + funct[name].func);
				
				 
				}; 					
};
var drawCircle0 = function(name,colour,lineWidth){
var sr = size[name].radius; 
// console.log(eval(size[name].radius)); 
// 	var size = 50;  
	canv.gcanvas.beginPath(); 
	canv.gcanvas.arc(
		position[name].x, position[name].y, eval(sr),	0,	2*Math.PI
		);
	canv.gcanvas.lineWidth=lineWidth; 
	canv.gcanvas.strokeStyle = colour;
	canv.gcanvas.stroke();
	canv.gcanvas.closePath();  

};

/// MOVE ////////////////////////////////////////////////////////////////////////////////
var move = function(name, coor){
			
	if((funct["move"+name] in funct) == true) {console.log(name + " is already moving!")}
	else {
	dt["move"+ name]={x: 0, y: 0}; 
	dt[name] = {x: 2*Math.PI/360, y: 2*Math.PI/360};
	funct["move"+name] = {func: "move0('"+name+"')"}; 
	if(coor == "stop") {delete funct["move" + name]}; 
	}
}; 
var move0 = function(name, coor){
// 	console.log(dt[name]); 
if (previous[name] == null || "") {previous[name] = {x: position[name].x, y: dimensions.gy/2}}; 
		previous[name].x = position[name].x; 
		previous[name].y = position[name].y; 
	
// 	console.log(position[name].x); 
	position[name].x = dimensions.gx/2+ Math.sin(dt["move" + name].x)*dimensions.gx/2; 
	position[name].y = dimensions.gy/2+ Math.cos(dt["move"+ name].y)*dimensions.gy/2; 
	dt["move"+ name].x += dt[name].x; 
	dt["move"+ name].y += dt[name].y; 
}; 







/////////////////////  Other functions that need to be updated ///////////////////////////
 
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