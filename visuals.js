var i = {}; 
var funct={}; 
var fadeRate = 100; 

var w; // width of our drawing context
var h; // height of our drawing context
var c; // a canvas context to use in 
var draw = function() {}; // redefined in performance, called every animation frame
var event = function(e) {}; // redefined in performance, called with events from server 
 
function setupVisuals() {
    // add a new canvas adjusted to display dimensions and store context for later use
    $('<canvas>').attr({id: "gcanvas"}).css({zIndex: $('canvas').length + 3}).insertBefore('#global');
    $('#global').css({zIndex: $('canvas').length + 3});
    adjustCanvasDimensions();
    c = document.getElementById('gcanvas').getContext('2d');
    // and activate our animation callback function 'tick'
    requestAnimationFrame(tick); // activate our animation callback function 'tick'
    setupShiftEnter(); // now shift-enter in any textarea evaluates that as JS for livecoding of visuals
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

function setupShiftEnter() {
    $('#edit1').keyup(function (event) {
	if (event.keyCode == 13 && event.shiftKey) {
	    var e1 = $('#edit1').val();
	    eval(e1);
	};
    });
    $('#edit3').keyup(function (event) {
	if(event.keyCode==13 && event.shiftKey) {
	    var e3 = $('#edit3').val();
	    eval(e3);
	};
    });
    $('#local1').keyup(function (event) {
	if(event.keyCode==13 && event.shiftKey) {
	    var l1 = $('#local1').val();
	    eval(l1);
	};
    });
}

function clear () {c.clearRect(0,0,w,h)};

function fade (x) {
    if(x!="stop") setTimeout(function() {fade()},fadeRate);
    c.beginPath();
    c.fillStyle = "rgba(255,255,255,0.1)";	
    c.fillRect(0,0,w,h);
    c.closePath();
}
	
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
	var position = {x:Math.random()*w, y:w*Math.random()}; 
	c.beginPath(); 
	c.arc(
		position.x,
		position.y,  
		50*Math.random(),	0,	2*Math.PI
							);
	c.lineWidth=lineWidth; 
	c.strokeStyle = colour;
	c.stroke();
	c.closePath();  
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
    var position = {x:Math.random()*w,y:h*Math.random(), 
	x0:Math.random()*w, y0:h*Math.random() }; 
	c.beginPath(); 
	c.moveTo(position.x,position.y); 
	c.lineTo(position.x0,position.y0); 
	c.lineWidth=lineWidth; 
	c.strokeStyle = colour;
	c.stroke(); 
	c.closePath(); 
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
 			else  {funct[name] ="drawSquare0('"+name+ "',"+"'"+type+"'"+","+"'"+colour+"'"+","+size+ "," +lw+ ")"};
 	  } 
 	  else {console.log("New function");
			i[name] = 0; 	
 	  	new drawSquare0(name,type,colour,size,lw); 
 	  	funct[name] = "drawSquare0('"+name+ "',"+"'"+type+"'"+","+"'"+colour+"'"+","+size+ ","+lw+")";
 	  	
 	  	} 					
};


		
var drawSquare0 = function(name, type, colour, size, lineWidth) {
		
		if (type !== "solid") {
		c.beginPath(); 
		c.lineWidth = 1;  
		c.rect(w/2+Math.sin(i[name])*w/2,h/2+Math.cos(3.01*i[name])*h/2,size, size);
		c.lineWidth = 1; 
		c.strokeStyle=colour;
		c.stroke();
		c.closePath(); 
		i[name]+=2*Math.PI/w; 
// 			console.log(i[name]);  

		} else {
		c.fillStyle=colour; 
		c.fillRect(w/2+Math.sin(i[name])*w/2,h/2+Math.cos(i[name])*h/2,size, size);	
		i[name] += 2*Math.PI/w*10; 
		; 
		}

};