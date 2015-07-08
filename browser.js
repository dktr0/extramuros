var ws;

function Osc() {}
jQuery.extend(Osc.prototype,jQuery.eventEmitter);
var osc = new Osc();

function setup() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var url = 'ws://' + location.hostname + ':1337';
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
	    $(osc).trigger(address);
	    eval( address + "(data.args)");
	    // ummm... we should check to make sure the function exists first!...
	}
	if(data.type == 'js') {
	    eval(data.code);
	}
    };
    for(var x=1;x<=20;x++) openEditor('edit' + x.toString());
    openEditor('chat');
    setupKeyboardHandlers();
    setupVisuals();
}

function getPassword() {
    var x = document.getElementById('password').value;
    if(x == null || password == "") {
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
    $('textarea').keypress(function (event) {
	if(event.keyCode == 13 && event.shiftKey && event.ctrlKey) {
	    // ctrl+shift+enter: evaluate buffer as Javascript through server
	    event.preventDefault();
	    var code = $(this).val();
	    evaluateJavaScriptGlobally(code);
	}
	else if(event.keyCode == 13 && event.ctrlKey) {
	    // ctrl+Enter: evaluate text as JavaScript in local browser
	    event.preventDefault();
	    var code = $(this).val();
	    eval(code);
	}
	else if(event.keyCode == 13 && event.shiftKey) {
	    // shift+Enter: evaluate buffer globally through the server   
	    event.preventDefault();
	    evaluateBuffer(event.target.id);
	};
    });
}
