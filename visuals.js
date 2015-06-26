

// When page is ready ...
$(document).ready(function() {
	// height and width of global div
	var g = $("#global"); 		// call div id = global
	gx = g.width(); 			// get width of global
	gy = g.height();		 	// get height of global
	// set the height and width of the canvas to that of global div
	
	var ccc = document.getElementById("c0"); // getting canvas element
	ccc.height = gy;			// setting canvas element height
	ccc.width = gx; 			// setting canvas element width
	ctx = ccc.getContext('2d'); // get canvas context - needed for html canvas
	
	var ccc0 = document.getElementById("c1"); // getting canvas element
	ccc0.height = gy;			// setting canvas element height
	ccc0.width = gx; 			// setting canvas element width
	ctx0 = ccc0.getContext('2d'); // get canvas context - needed for html canvas
	
	var ccc1 = document.getElementById("c2"); // getting canvas element
	ccc1.height = gy;			// setting canvas element height
	ccc1.width = gx; 			// setting canvas element width
	ctx1 = ccc1.getContext('2d'); // get canvas context - needed for html canvas
	
	var ccc2 = document.getElementById("c3"); // getting canvas element
	ccc2.height = gy;			// setting canvas element height
	ccc2.width = gx; 			// setting canvas element width
	ctx2 = ccc1.getContext('2d'); // get canvas context - needed for html canvas

	
	 
	
	var b00Counter=0; 
	$("#b1").click(function() {b00Counter=b00Counter+1;levelMeter0(b00Counter);}); 
	var b01Counter=0;
	$("#b2").click(function() {b01Counter=b01Counter+1;levelMeter1(b01Counter);});
	var b02Counter=0;
	$("#b3").click(function() {b02Counter=b02Counter+1;levelMeter2(b02Counter);}); 
	var b03Counter=0;
	$("#b4").click(function() {b03Counter=b03Counter+1;levelMeter3(b03Counter);}); 
	var b04Counter=0;
	$("#b5").click(function() {b04Counter=b04Counter+1;levelMeter3(b04Counter);}); 
	$("#eval1").click(function() {}); 
	
	/// evaluate edit1 on shift+enter
// 	$('#edit1').keyup(function (event) {
//        if (event.keyCode == 13 && event.shiftKey) {
// //          alert($('#edit1').val()); 
// 			 	var e1 = $('#edit1').val(); 
// 				console.log(e1); 
// 			 	eval(e1); 
// 			 	 
//            
//       }
// });

	var prevlevel=0; 
	//////////////////////////// FUNCTIONS
	function square(type, size, colour) {
		// colour needs to be a string
		var i = 0; 
		if (type !== "solid") {
		ctx2.rect(gx/2 ,gy/2,size,size);
		ctx2.lineWidth = 1; 
		ctx2.strokeStyle=colour;
		ctx2.stroke();
		setInterval( function() {
			ctx2.clearRect(0,0,gx,gy); 
			ctx2.rect(gx/2+Math.sin(i)*gx/2,gy/2+Math.cos(3.01*i)*gy/2,size, size);
		ctx2.lineWidth = 1; 
		ctx2.strokeStyle=colour;
		ctx2.stroke()
			
			
			i+=2*Math.PI/gx; 
			// console.log(i);  
			},1);
		} else {
		ctx2.fillStyle=colour; 
		ctx2.fillRect(gx/2,gy/2,size, size); 
		setInterval( function() {
			ctx2.clearRect(0,0,gx,gy); 
			ctx2.fillRect(gx/2+Math.sin(i)*gx/2,gy/2+Math.cos(i)*gy/2,size, size);
			
			i+=2*Math.PI/gx; 
			console.log(i);  
			},1); 
		}
		
		}; 
// 		ctx1.clearRect(0,0,gx,prevlevel);
	
		
		
	
	
	function level() {
// 	alert('here'); 
	b02Counter=b02Counter+1;
	levelMeter2(b02Counter);
	};
	
	function levelMeter3(x) { 
// 	console.log(x%2); 
	if(x % 2 == 0) {
		ctx1.clearRect(0,0,gx,gy);
 		//alert('here'); 
	

      }
      else {
//       alert(i); 
				  	
					ctx1.clearRect(0,0,gx,prevlevel);
					var level = Math.random() * gy ;
					
					ctx1.fillStyle="yellow";
					ctx1.fillRect(0,0,gx,level);
					ctx1.closePath(); 
					prevlevel = level
					
					setTimeout(function(){  // calls function after specified time
						levelMeter3(b03Counter);    
							}, 1000/60);
					
					}; 
					
      
      }; 
      
		// level meters for all textareas
function levelMeter2(x) { 
// 	console.log(x%2); 
	if(x % 2 == 0) {
		ctx.clearRect(0,0,gx,gy);
		ctx0.clearRect(0,0,gx,gy); 
		setTimeout(function(){  // calls function after specified time
						ctx0.clearRect(0,0,gx,gy);   
							}, 1000);
		
// alert(x); 
	

      }
   
      else {
      	var e1 = [$("#edit1"),$("#edit2"),$("#edit3"),$("#edit1") ]; 
				var e1position = [e1[0].position(),e1[1].position(),e1[2].position(), e1[0].position()];
				
				var levelx = [e1position[0].left+e1[0].width()+4, e1position[1].left+e1[1].width()+4,e1position[2].left+e1[2].width()+4,e1position[0].left+e1[0].width()+40 ] ; // left position
				var levely = [e1position[0].top,e1position[1].top,e1position[2].top,e1position[0].top ]; 
				var level = [e1[0].height(),e1[1].height(),e1[2].height(),(e1[0].height()+e1[1].height()+e1[2].height())]; // replace with function
      	var count = 0
      	ctx.clearRect(0,0,gx,gy);
//       	alert(i); // creates flicker in Chrome (@ least) when the option to not have anymore window pop up is selected
      	for (var i=0; i<4; i++) {
      	
					
					 
					level[i] = Math.random() * level[i]*0.5 + level[i]*0.5 ;
					ctx.beginPath(); 
					ctx.moveTo(levelx[i], levely[i]); 
					ctx.lineTo(levelx[i], levely[i]+level[i]); 
					ctx.strokeStyle = "blue";
					ctx.lineWidth = 4;
					
					if(i < 3 && level[i] > 0.9*e1[i].height()) {
						// alert("here"); 
						level123(levelx[i],levely[i],level[i]); 
						
							};
					if(i==3) {ctx.lineWidth = 40;
						if (level[i] > (2.9*e1[i].height())) {level4(levelx[i],levely[i],level[i]);	}; 
							}; 
					ctx.stroke(); 
					ctx.closePath(); 
					
					}; 
					setTimeout(function(){  // calls function after specified time
						levelMeter2(b02Counter);    
							}, 1000/60);
      
      }; 
};
////
function level4(levelx, levely, level) {
	ctx0.lineWidth = 40;
	ctx0.strokeStyle = "red";
	ctx0.beginPath(); 
	ctx0.moveTo(levelx, levely+level) 
	ctx0.lineTo(levelx, levely+level-4);
	ctx0.stroke(); 
	ctx0.closePath();
// 	alert("red")
	
};
function level123(levelx, levely, level) {
	ctx0.lineWidth = 4;
	ctx0.beginPath(); 
	ctx0.strokeStyle = "red";
	ctx0.beginPath(); 
	ctx0.moveTo(levelx, levely+level) 
	ctx0.lineTo(levelx, levely+level-4);
	ctx0.fillStyle = "rgba(255,255,255,0)";
// 	ctx0.fillRect(0,0,c0.width, c0.height);
	ctx0.stroke(); 
	ctx0.closePath();
	setTimeout(fadeOut,100);
							//alert("red")
};

function fadeOut() {
ctx0.fillStyle = "rgba(255,255,255,0.1)";
ctx0.fillRect(0,0,c0.width, c0.height);
setTimeout(fadeOut0,500);

};
function fadeOut0() {
for(var i=0; i<20; i++) {
ctx0.fillStyle = "rgba(255,255,255,0.01)";
ctx0.fillRect(0,0,c0.width, c0.height);
// console.log("fadeOut: " + i);  

// setTimeout(fadeOut,1000);

function loop (i,  delay) {
   setTimeout(function () {
			//console.log(dt);
			fadeout0();        //  your code here
			if (--i) {
				//console.log("titles")
				loop(2, 500);
			}  //  decrement i and call myLoop again if i > 0
			if (i==0)console.log( funct + "  complete")
   }, delay)};
   
};
; /// how to the executed when the last "fade" has occured? 
};

// level meters for all textareas
function levelMeter1(x) { 
// 	console.log(x%2); 
	if(x % 2 == 0) {
		ctx.clearRect(0,0,gx,gy);
		console.log('off'); 
	

      }
      else {
// 				console.log('on');  
      	var e1 = [$("#edit1"),$("#edit2"),$("#edit3"),$("#edit1") ]; 
				var e1position = [e1[0].position(),e1[1].position(),e1[2].position(), e1[0].position()];
				
				var levelx = [e1position[0].left+e1[0].width()+4, e1position[1].left+e1[1].width()+4,
				e1position[2].left+e1[2].width()+4,e1position[0].left+e1[0].width()+40 ] ; // left position
// 				for(var i=0; i<levelx.length; i++){console.log(e1[i].width())};				
				var levely = [e1position[0].top,e1position[1].top,e1position[2].top,e1position[0].top ]; 
				var level = [e1[0].height(),e1[1].height(),e1[2].height(),(e1[0].height()+e1[1].height()+e1[2].height())]; // replace with function
      	var count = 0
      		ctx.clearRect(0,0,gx,gy);
      	
      	for (var i=0; i<4; i++) {
      	
					
// 					alert(i); 
					level[i] = Math.random() * level[i]*0.5 + level[i]*0.5 ;
					ctx.beginPath(); 
					ctx.moveTo(levelx[i], levely[i]); 
					ctx.lineTo(levelx[i], levely[i]+level[i]); 
					ctx.strokeStyle = "blue";
					ctx.lineWidth = 4;
					
				
					if(i==3) {ctx.lineWidth = 40;}; 
					
					ctx.stroke(); 
					ctx.closePath(); 
					
					}; 
					setTimeout(function(){  // calls function after specified time
						levelMeter1(b01Counter);    
							}, 1000/60);
      
      }; 
}; 



/// Single meter on first textarea
function levelMeter0(x) { 
 
// 	console.log(x%2); 
	if(x % 2 == 0) {
	ctx.clearRect(0,0,gx,gy);
	
	

      }
      else {
//       console.log('mod2'); 
      	var e1 = $("#edit1"); 
				var e1position = $("#edit1").position();
				var levelx = e1position.left+e1.width()+4; // left position
				var levely = e1position.top; 
				var level = e1.height(); // replace with function
      	
      	ctx.clearRect(0,0,gx,gy);
				level = Math.random()*e1.height();
				ctx.beginPath(); 
				ctx.moveTo(levelx, levely); 
				ctx.lineTo(levelx, levely+level); 
				ctx.strokeStyle = "blue";
				ctx.lineWidth = 4;
				ctx.stroke(); 
				ctx.closePath();
				var location = {x:levelx, y:levely}; 
			// 	prevPos.push(location);
			// 	console.log(level); 
				setTimeout(function(){  // calls function after specified time
					levelMeter0(b00Counter);    
						}, 1000/60);
      
      }; 
}; 



}); 









// window.onload = function setupVisuals() {
// 	// ***** create canvas(es) and set the width and height to 100%
// 	var canvas = document.createElement('canvas');
// 
// canvas.id = "CursorLayer";
// canvas.width = 1224;
// canvas.height = 768;
// canvas.style.zIndex = 8;
// canvas.style.position = "absolute";
// canvas.style.border = "1px solid";
// 
// 
// var body = document.getElementsByTagName("body")[0];
// body.appendChild(canvas);
// 
// cursorLayer = document.getElementById("CursorLayer");
// 
// console.log(cursorLayer);
// 
// }; 
// 
// 
// 
// // do you want me to add canvas in the setup function or just add them to the index files
// 
// 
