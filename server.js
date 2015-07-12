// required dependencies
require('coffee-script');
var express = require('express');
var sharejs = require('share');
var nopt = require('nopt');
var zmq = require('zmq');
var WebSocket = require('ws');
var osc = require('osc');

// global variables
var stderr = process.stderr;

// parse command-line options
var knownOpts = { 
    "password" : [String, null],
    "http-port" : [Number, null],
    "zmq-port" : [Number, null],
    "ws-port" : [Number, null],
    "osc-port" : [Number, null],
    "help": Boolean
};

var shortHands = {
    "p" : ["--password"],
    "h" : ["--http-port"],
    "z" : ["--zmq-port"],
    "w" : ["--ws-port"],
    "o" : ["--osc-port"]
};

var parsed = nopt(knownOpts,shortHands,process.argv,2);

if(parsed['help']!=null) {
    stderr.write("extramuros server.js usage:\n");
    stderr.write(" --help (-h)               this help message\n");
    stderr.write(" --password [word] (-p)    password to authenticate messages to server (required)\n");
    stderr.write(" --http-port (-h) [number] TCP port for plain HTTP requests (default: 8000)\n");
    stderr.write(" --zmq-port (-z) [number]  TCP port for 0mq connections to client (default: 8001)\n");
    stderr.write(" --ws-port (-w) [number]   TCP port for WebSocket connections to browsers and clients (default: 8002)\n");
    stderr.write(" --osc-port (-o) [number]  UDP port on which to receive OSC messages (default: none)\n");
    process.exit(1);
}

if(process.argv.length<3) {
    stderr.write("extramuros: use --help to display available options\n");
}

var httpPort = parsed['http-port'];
if(httpPort==null) httpPort = 8000;
var zmqPort = parsed['zmq-port'];
if(zmqPort==null) zmqPort = 8001;
var wsPort = parsed['ws-port'];
if(wsPort==null) wsPort = 8002;
var oscPort = parsed['osc-port'];
var password = parsed['password'];
if(password == null) {
    stderr.write("Error: --password option is not optional!\n");
    process.exit(1);
}

var server = express();
server.use(express.static(__dirname));

var pub = zmq.socket('pub');
var zmqAddress = "tcp://*:" + zmqPort.toString();
pub.bind(zmqAddress, function(err) {
  if(err) {
      console.log(err);
      process.exit(1);
  }
  else console.log("extramuros: listening on " + zmqAddress + " for 0mq subscribers");
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

var wss = new WebSocket.Server({port: wsPort});
stderr.write("extramuros: listening for WebSocket connections on port " + wsPort.toString()+"\n");
wss.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(data);
};

var udp;
if(oscPort != null) {
    udp = new osc.UDPPort( {
	localAddress: "0.0.0.0",
	localPort: oscPort
    });
    stderr.write("extramuros: listening for OSC on UDP port " + udpPort.toString()+"\n");
}

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
    if(udp!=null) udp.addListener("message",udpListener);
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
	if(n.request == "oscFromClient") {
	    if(n.password == password) {
		forwardOscFromClient(n.address,n.args);
	    }
	}
	if(n.request == "feedback") {
	    if(n.password == password) {
		forwardFeedbackFromClient(n.text);
	    }
	}
    });
    ws.on("close",function(code,msg) {
	console.log("");
	if(udp!=null)udp.removeListener("message",udpListener);
    });
});

if(udp!=null)udp.open();

function evaluateBuffer(name) {
    sharejs.client.open(name,'text','http://127.0.0.1:' + httpPort + '/channel', function (err,doc) {
	console.log(doc.getText());
	pub.send(doc.getText());
    });
}

function evaluateJavaScriptGlobally(code) {
    var n = { 'type': 'js', 'code': code };
    wss.broadcast(JSON.stringify(n));
}

function forwardOscFromClient(address,args) {
    var n = { 'type': 'osc', 'address': address, 'args': args };
    wss.broadcast(JSON.stringify(n));
}

function forwardFeedbackFromClient(text) {
    var n = { 'type': 'feedback', 'text': text };
    wss.broadcast(JSON.stringify(n));
}

var shareserver = sharejs.server.attach(server, options);

server.get('/?', function(req, res, next) {
  res.writeHead(302, {location: '/index.html'});
  res.end();
});
server.listen(httpPort);
console.log("extramuros: listening on port " + httpPort + " for HTTP");

process.title = 'extramuros';
process.on('SIGINT',function() { pub.close(); });
