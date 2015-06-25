function postSignal(name) {
  var password = document.getElementById('password').value;
  if(password == null || password == "") {
    alert("You must enter a password to evaluate code.");
  }
  else {
    $.post(name + "-" + password, function(x) {});
  }
}

function openEditor(name) {
  sharejs.open(name,'text',function(error,doc) {
    if(error) console.log(error);
    else {
      var elem = document.getElementById(name);
      elem.disabled = false;
      doc.attach_textarea(elem);
    }
  });
}

function setup() {
<<<<<<< HEAD
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var url = 'ws://' + location.hostname + ':1337';
    console.log("attempting websocket connection to " + url);
    var con = new WebSocket(url);
    con.onopen = function () {
	console.log("extramuros websocket connection opened");
    };
    con.onerror = function () {
	console.log("ERROR opening extramuros websocket connection");
    };
    con.onmessage = function (m) {
	var data = JSON.parse(m.data);
	if(data.address == "/play") {
	    var event = {
		sound: data.args[1]
	    };
	    play(event);
	}
	else {
	    console.log(data);
	}
    };
=======
>>>>>>> master
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
}

function play(e) {
    $('#lastPlayEvent').html(e.sound);
}



