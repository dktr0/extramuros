var stderr = process.stderr;
var nopt = require('nopt');
var zmq = require('zmq');

var knownOpts = { 
    "server" : [String, null],
    "port" : [Number, null],
    "newlines-as-spaces" : Boolean };
var shortHands = {
    "s" : ["--server"],
    "p" : ["--port"],
    "n" : ["--newlines-as-spaces"] };
var parsed = nopt(knownOpts,shortHands,process.argv,2);

if(parsed['server'] == null) {
    console.log("Error: MUST specify address of server's downstream with --server");
    console.log("Usage:");
    console.log(" --server (-s) [address]   address of server's downstream");
    console.log(" --port (-p) [number]      port on which to connect to server (default: 8001)");
    console.log(" --newlines-as-spaces (-n) converts any received newlines to spaces on stdout");
    process.exit(1);
}

var newlines = parsed['newlines-as-spaces'];
if(newlines) {
    stderr.write("converting any received newlines to spaces on stdout\n");
}

var server = parsed['server'];
var port = parsed['port'];
if(port == null) { port = 8001; }
var address = "tcp://" + server + ":" + (port.toString());

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

process.on('SIGINT', function() { sub.close(); } );
