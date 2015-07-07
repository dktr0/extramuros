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
    openEditor('edit1');
    openEditor('edit2');
    openEditor('edit3');
    openEditor('edit4');
    openEditor('edit5');
    openEditor('edit6');
    openEditor('edit7');
    openEditor('edit8');
    openEditor('edit9');
    openEditor('chat');
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

