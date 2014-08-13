var stderr = process.stderr;

// initialize tidal
// console.log(':m Sound.Tidal.Context');
//for(var x=1;x<10;x++) { console.log('d' + x + ' <- dirtstream "d' + x + '"'); }
//console.log('bps <- bpsSetter');
//stderr.write("Tidal initialized\n");

// subscribe to 0mq socket with code to evaluate 
var address = process.argv[2];
var zmq = require('zmq');
var sub = zmq.socket('sub');
sub.on('error',function (err) {
  stderr.write("error event on socket: " + err);
});
sub.on('message',function (msg) { 
  console.log(msg.toString());
  stderr.write(msg.toString()+"\n");
});

stderr.write("connecting to " + address + " as subscriber\n");
sub.connect(address);
sub.subscribe('');

// keyboard input also produces output that goes down the pipe
process.openStdin().addListener("data", function (d) { console.log(d.toString()); } );

process.on('SIGINT', function() { sub.close(); } );
