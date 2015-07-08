var ws;

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
	var address = data.address.substring(1);
	eval( address + "(data.args)");
	// ummm... we should check to make sure the function exists first!...
    };
    for(var x=1;x<=20;x++) openEditor('edit' + x.toString());
    openEditor('chat');
    setupKeyboardHandlers();
    setupVisuals();
}

function evaluateBuffer(name) {
  var password = document.getElementById('password').value;
  if(password == null || password == "") {
    alert("You must enter a password to evaluate code.");
  }
  else {
    var msg = {
	request: "eval",
	bufferName: name,
	password: password
    };
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
	if(event.keyCode == 13 && event.ctrlKey) {
	    // ctrl+Enter: evaluate text as JavaScript in local browser
	    event.preventDefault();
	    var code = $(this).val();
	    eval(code);
	};
	if(event.keyCode == 13 && event.shiftKey) {
	    // shift+Enter: evaluate buffer globally through the server   
	    event.preventDefault();
	    evaluateBuffer(event.target.id);
	};
    });
}
