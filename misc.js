function loop (i,  delay, f) {
   setTimeout(function () {
			//console.log(dt);
			f();        //  your code here
			if (--i) {
				//console.log("titles")
				loop(i, delay, f);
			}  //  decrement i and call myLoop again if i > 0
			if (i==0)console.log( f + "  complete")
   }, delay);
};

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