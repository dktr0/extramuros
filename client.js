var stderr = process.stderr;
var nopt = require('nopt');
var zmq = require('zmq');

var knownOpts = { 
    "server" : [String, null],
    "port" : [Number, null],
    "newlines-as-spaces" : Boolean,
    "osc-port" : [Number, null],
    "ws-port" : [Number, null],
    "password" : [String, null]
};

var shortHands = {
    "s" : ["--server"],
    "p" : ["--port"],
    "n" : ["--newlines-as-spaces"],
    "o" : ["--osc-port"],
    "w" : ["--ws-port"],
    "d" : ["--password"]
};
var parsed = nopt(knownOpts,shortHands,process.argv,2);

if(parsed['server'] == null) {
    console.log("Error: MUST specify address of server's downstream with --server");
    console.log("Usage:");
    console.log(" --server (-s) [address]   address of server's downstream");
    console.log(" --port (-p) [number]      TCP port on which to connect to server (default: 8001)");
    console.log(" --newlines-as-spaces (-n) converts any received newlines to spaces on stdout");
    console.log(" --osc-port [number]       UDP port on which to receive OSC messages (default: 8000)");
    console.log(" --ws-port [number]        port for WebSocket connection to server (default: 8002)");
    console.log(" --password [word] (-d)    password to authenticate messages to server");
    process.exit(1);
}

var newlines = parsed['newlines-as-spaces'];
if(newlines) {
    stderr.write("converting any received newlines to spaces on stdout\n");
}

var server = parsed['server'];
var port = parsed['port'];
if(port == null) { port = 8001; }
var oscPort = parsed['osc-port'];
if(oscPort == null) { oscPort = 8000; }
var wsPort = parsed['ws-port'];
if(wsPort == null) { wsPort = 8002; }
var address = "tcp://" + server + ":" + (port.toString());
var wsAddress = "ws://" + server + ":" + (wsPort.toString());
var password = parsed['password'];
if(password == null) { password = ""; }

var sub = zmq.socket('sub');
sub.on('error',function (err) {
  stderr.write("error event on socket: " + err);
});
sub.on('message',function (msg) {
  var s;
  if(newlines) { // convert newline sequences to whitespace
      s = msg.toString().replace(/\n|\n\r|\r\n|\r/g," ");
  }
  else { // leave newline sequences as is
      s = msg.toString();
  }
  console.log(s);
  stderr.write(s+"\n");
});

stderr.write("connecting to " + address + " as subscriber\n");
sub.connect(address);
sub.subscribe('');

// keyboard input also produces output that goes down the pipe
process.openStdin().addListener("data", function (d) { console.log(d.toString()); } );

var WebSocket = require('ws');
var osc = require('osc');
var ws = new WebSocket(wsAddress);

var udp = new osc.UDPPort( {
    localAddress: "0.0.0.0",
    localPort: oscPort
});

ws.on('open',function() {
    stderr.write("webSocket connection " + wsAddress + " opened");
});

udp.on('message',function(m) {
    var n = {
	'request': 'oscFromClient',
	'password' : password,
	'address': m.address,
	'args': m.args
    };
    if(password == null || password == "") {
	stderr.write("forwarding OSC but no password was set\n");
    } 
    ws.send(JSON.stringify(n));
});

udp.open();

process.on('SIGINT', function() { sub.close(); } );
