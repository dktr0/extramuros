extramuros: creating visualizations using javascript and html5's canvas
==========

1. draw to screen (solid square, square, circle, square, line, text)


There are a few global variables:
c is the canvas object that the visualizations are to be drawn to. 
w is the width of the screen. 
h is the height of the screen. 


I. Draw a square; 
 c.
 
 c.fillRect()
		c.lineWidth = 1;  
		c.rect(x,y,length,width);
		c.lineWidth = 1; 
		c.strokeStyle=colour;
		c.stroke();
Ia. Fill a square
II. Draw a Circle	

Drawing a line 
To draw a line we first need to set a starting point. The top left corner is 0,0.
c.moveTo(0,0); 
Next we set the position of where to draw the line to. w/2,h/2 is the middle of the screen.
c.lineTo(0,0);
The default colour is black so we need to change it so that it is visable. 
c.strokeStyle = "red"; 
Finally we need to draw it to the canvas. 
c.stroke(); 

c.moveTo(0,0); 
c.lineTo(w/2,y/2); 
c.strokeStyle = "red"; 
c.stroke; 

VI. Text

c.fillText("Hello World", w/2, h/2); 

evaluate: control+enter 
shared evaluation: control+shift+enter
retick: control+
clear screen: 



Note: when the screen is cleared the drawing functions that require stroke need to have the
beginPath and closePath such that when it is cleared and then redrawn on the previous strokes
are removed