var ws;

function Osc() {}
jQuery.extend(Osc.prototype,jQuery.eventEmitter);
var osc = new Osc();

function setup(nEditors) {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var url = 'ws://' + location.hostname + ':8002';
    console.log("attempting websocket connection to " + url);
    ws = new WebSocket(url);
    ws.onopen = function () {
	console.log("extramuros websocket connection opened");
    };
    ws.onerror = function () {
	console.log("ERROR opening extramuros websocket connection");
    };
    ws.onmessage = function (m) {
	var data = JSON.parse(m.data);
	if(data.type == 'osc') {
	    var address = data.address.substring(1);
	    // Tidal-specific double-mappings for incoming /play messages
	    if(address == "play") {
		data.args.name = data.args[1];
		data.args.begin = data.args[3];
		data.args.end = data.args[4];
		data.args.speed = data.args[5];
		data.args.pan = data.args[6];
		data.args.gain = data.args[14];
		// full list of parameters at bottom
	    }
	    $(osc).trigger(address);
	    eval( address + "(data.args)");
	    // ummm... we should check to make sure the function exists first!...
	}
	if(data.type == 'js') {
	    eval(data.code);
	}
	if(data.type == 'feedback') {
	    var fb = $('#feedback');
	    var oldText = fb.val();
	    if(oldText.length > 10000) oldText = ""; // short-term solution...
	    fb.val(oldText+data.text);
	    fb.scrollTop(fb[0].scrollHeight);
	}
    };
    for(var x=1;x<=nEditors;x++) openEditor('edit' + x.toString());
    setupKeyboardHandlers();
    setupVisuals();
}


function getPassword() {
    var x = document.getElementById('password').value;
    if(x == null || x == "") {
	alert("You must enter a password to evaluate code.");
	return null;
    }
    return x;
}

function evaluateBuffer(name) {
    var password = getPassword();
    if(password) {
	var msg = { request: "eval", bufferName: name, password: password };
	ws.send(JSON.stringify(msg));
    }
}

function evaluateJavaScriptGlobally(code) {
    var password = getPassword();
    if(password) {
	var msg = { request: "evalJS", code: code, password: password };
	ws.send(JSON.stringify(msg));
    }
}

function openEditor(name) {
    var elem = document.getElementById(name);
    if( elem != null) {
	sharejs.open(name,'text',function(error,doc) {
	    if(error) console.log(error);
	    else {
		elem.disabled = false;
		doc.attach_textarea(elem);
	    }
	});
    }
}

function setupKeyboardHandlers() {
    $('textarea').keydown(function (event) {
	if(event.which == 13 && event.shiftKey && event.ctrlKey) {
	    // ctrl+shift+enter: evaluate buffer as Javascript through server
	    event.preventDefault();
	    var code = $(this).val();
	    evaluateJavaScriptGlobally(code);
	}
	else if(event.which == 13 && event.ctrlKey) {
	    // ctrl+Enter: evaluate text as JavaScript in local browser
	    event.preventDefault();
	    var code = $(this).val();
	    eval(code);
	}
	else if(event.which == 13 && event.shiftKey) {
	    // shift+Enter: evaluate buffer globally through the server   
	    event.preventDefault();
	    evaluateBuffer(event.target.id);
	}
	else if(event.which == 67 && event.ctrlKey && event.shiftKey) {
	    // ctrl+shift+c: global clear() on visuals
	    event.preventDefault();
	    evaluateJavaScriptGlobally("clear();");
	}
	else if(event.which == 82 && event.ctrlKey && event.shiftKey) {
	    // ctrl+shift+r: global retick() on visuals
	    event.preventDefault();
	    evaluateJavaScriptGlobally("retick();");
	}
	else if(event.which == 67 && event.altKey) {
	    // alt+c: global clear() on visuals
	    event.preventDefault();
	    evaluateJavaScriptGlobally("clear();");
	}
	else if(event.which == 82 && event.altKey) {
	    // alt+r: global retick() on visuals
	    event.preventDefault();
	    evaluateJavaScriptGlobally("retick();");
	}
    });
}

// path = "/play",
// params = [  
//1// S "sound" Nothing,     
//2// F "offset" (Just 0),   
//3// F "begin" (Just 0),     
//4// F "end" (Just 1),      
//5// F "speed" (Just 1),       
//6// F "pan" (Just 0.5),     
//7// F "velocity" (Just 0),
//8// S "vowel" (Just ""),
//9// F "cutoff" (Just 0),
//10// F "resonance" (Just 0),
//11// F "accelerate" (Just 0),
//12// F "shape" (Just 0),
//13// I "kriole" (Just 0),
//14// F "gain" (Just 1),
//15// I "cut" (Just (0)),
//16// F "delay" (Just (0)),
//17// F "delaytime" (Just (-1)),
//18// F "delayfeedback" (Just (-1)),
//19// F "crush" (Just 0),
//20// I "coarse" (Just 0),
//21// F "hcutoff" (Just 0),
//22// F "hresonance" (Just 0),
//23// F "bandf" (Just 0),
//24// F "bandq" (Just 0),
//25// S "unit" (Just "rate"),
//26// I "loop" (Just 1)
// ]
