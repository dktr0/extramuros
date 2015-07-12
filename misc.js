function semitones(x) {
    // converts speed factor to semitones up/down
    // i.e. speed of 2 becomes 12 semitones (up)
    // speed of 0.5 becomes -12 semitones (down)
    return Math.log(x)/Math.log(1.059466);
}

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
	if(funct.fade !== 0) {
		if (x == "stop") {fadeCondition=1; console.log("fade not running")}
		else {
			console.log("turning funct.fade to on"); 	
			funct.fade = 0; 
			fadeCondition=0; 
			if(x !== null) {fadeRate = x;}; 
			fader(); // call fade function
			console.log('fading :'+ fadeRate + " ms"); 
		} 
		} else {
			if (x == "stop") {fadeCondition=1; delete funct.fade}; 
			if (x !== null) {fadeRate = x}; 
					console.log('fading :'+ fadeRate + " ms"); 
		} 
	
}; 
/// Fade function -- has its own setTimeout function such that the fadeRate can be modified
var fader = function(){
	if(fadeCondition == 0) {
// 		console.log('fade0'); 
		c.beginPath();
		c.fillStyle = "rgba(0,0,0,0.1)";	
		c.fillRect(0,0,w, h);
		c.closePath(); 	
		setTimeout(function(){fader()}, fadeRate); 
		} else {
		console.log('fading stopped'); 
		c.beginPath();
		c.fillStyle = "rgba(255,255,255,0.1)";	
		c.fillRect(0,0,w, h);
		c.closePath();
		}
};
