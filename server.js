require('coffee-script');
var express = require('express');
var server = express();
server.use(express.static(__dirname));

var sharejs = require('share');

var zmq = require('zmq');
var pub = zmq.socket('pub');

pub.bind('tcp://*:8001', function(err) {
  if(err) console.log(err);
  else console.log("listening on port 8001 for subscribers");
});

var stdin = process.openStdin();
stdin.addListener("data", function (d) { pub.send(d); });

var options = {
  db: {type: 'none'},
  browserChannel: {cors: '*'},
  auth: function(client, action) {
    // This auth handler rejects any ops bound for docs starting with 'readonly'.
    if (action.name === 'submit op' && action.docName.match(/^readonly/)) {
      action.reject();
    } else {
      action.accept();
    }
  }
};

var WebSocket = require('ws');
var osc = require('osc');
var wss = new WebSocket.Server({port: 1337});
wss.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(data);
};

var udp = new osc.UDPPort( {
    localAddress: "0.0.0.0",
    localPort: 7772
});

// udp.on("message",function(m) {
//    console.log(m.address,m.args);
// });

var password = process.argv[2];

wss.on('connection',function(ws) {
    // route incoming OSC back to browsers
    var udpListener = function(m) {
	var n = {
	    'type': 'osc',
	    'address': m.address,
	    'args': m.args
	};
	ws.send(JSON.stringify(n));
    };
    udp.addListener("message",udpListener);
    // handle evaluation requests from browsers
    ws.on("message",function(m) {
	var n = JSON.parse(m);
	if(n.request == "eval") {
	    if(n.password == password) {
		evaluateBuffer(n.bufferName);
	    }
	}
	if(n.request == "evalJS") {
	    if(n.password == password) {
		evaluateJavaScriptGlobally(n.code);
	    }
	}
    });
    ws.on("close",function(code,msg) {
	console.log("");
	udp.removeListener("message",udpListener);
    });
});



udp.open();

function evaluateBuffer(name) {
    sharejs.client.open(name,'text','http://127.0.0.1:' + port + '/channel', function (err,doc) {
	console.log(doc.getText());
	pub.send(doc.getText());
    });
}

function evaluateJavaScriptGlobally(code) {
    var n = { 'type': 'js', 'code': code };
    wss.broadcast(JSON.stringify(n));
}

var port = 8000;
console.log("extramuros");
console.log(" using sharejs v" + sharejs.version);
console.log(" password is: " + password);
var shareserver = sharejs.server.attach(server, options);

server.get('/?', function(req, res, next) {
  res.writeHead(302, {location: '/index.html'});
  res.end();
});
server.listen(port);
console.log("Listening on port " + port + " for HTTP");

process.title = 'extramuros';
process.on('SIGINT',function() { pub.close(); });

