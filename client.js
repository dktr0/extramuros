// our required dependencies
var spawn = require('child_process').spawn;
var nopt = require('nopt');
// var zmq = require('zmq');
var WebSocket = require('ws');
var osc = require('osc');
var fs = require('fs');
var path = require('path');

// some global variables
var stdin = process.stdin;
var stderr = process.stderr;
var output = process.stdout;

var defaultFeedbackFunction = function(x) {
  stderr.write(x + "\n");
}

// parse command-line options
var knownOpts = {
    "server" : [String, null],
    "osc-port" : [Number, null],
    "ws-port" : [Number, null],
    "password" : [String, null],
    "help": Boolean,
    "feedback": Boolean,
    "tidal": Boolean,
    "tidalVisuals": Boolean,
    "tidalCabal": Boolean,
    "tidalCustom": [path],
    "foxdot": Boolean,
    "foxdotVisuals": Boolean,
    "foxdotCustom": [path],
    "sonic-pi": Boolean,
    "newlines-as-spaces" : Boolean
};

var shortHands = {
    "s" : ["--server"],
    "n" : ["--newlines-as-spaces"],
    "o" : ["--osc-port"],
    "w" : ["--ws-port"],
    "p" : ["--password"],
    "t" : ["--tidal"],
    "T" : ["--tidalCustom"],
    "t" : ["--foxdot"],
    "h" : ["--help"],
    "f" : ["--feedback"]
};

var parsed = nopt(knownOpts,shortHands,process.argv,2);

if(parsed['help']!=null) {
    stderr.write("extramuros client.js usage:\n");
    stderr.write(" --help (-h)                 this help message\n");
    stderr.write(" --server (-s) [address]     address of server's downstream (default:localhost)\n");
    stderr.write(" --ws-port [number]          port for OSC WebSocket connection to server (default: 8000)\n");
    stderr.write(" --osc-port [number]         UDP port on which to receive OSC messages (default: none)\n");
    stderr.write(" --password [word] (-p)      password to authenticate messages to server\n");
    stderr.write(" --feedback (-f)             send feedback from stdin to server\n");
    stderr.write(" --tidal (-t)                launch Tidal (as installed by stack)\n");
    stderr.write(" --tidalCabal                launch Tidal (as installed by cabal)\n");
    stderr.write(" --sonic-pi                  for Sonic Pi (each evaluation handled by sonic-pi-tool)\n");
    stderr.write(" --foxdot (-d)               launch FoxDot\n");
    stderr.write(" --newlines-as-spaces (-n)   converts any received newlines to spaces on stdout\n");
    process.exit(1);
}

if(process.argv.length<3) {
    stderr.write("extramuros: use --help to display available options\n");
}

// before setting up connections, set some defaults and look for problems
var newlines = parsed['newlines-as-spaces'];
var server = parsed['server'];
if(server == null) { server = "localhost"; }
var port = parsed['ws-port'];
if(port == null) { port = 8000; }
var oscPort = parsed['osc-port'];
var feedback = parsed['feedback'];
var wsAddress = "ws://" + server + ":" + (port.toString());
var password = parsed['password'];
if(oscPort!=null && password == null) {
    stderr.write("Error: Password required if an OSC port is specified\n");
    process.exit(1);
}

var sonicPi = parsed['sonic-pi'];
var withTidal = parsed['tidal'];
var withTidalCabal = parsed['tidalCabal'];
var withTidalVisuals = parsed['tidalVisuals'];
var withCustomTidalBoot = parsed['tidalCustom'];
var withFoxDot = parsed['foxdot'];
var withFoxDotVisuals = parsed['foxdotVisuals'];
var withCustomFoxDotBoot = parsed['foxdotCustom'];

if(withTidalCabal != null || withTidalVisuals != null || withCustomTidalBoot != null) withTidal = true;
if(withCustomTidalBoot!=null) {                      // custom tidal boot file provided
  if(withTidalVisuals==true) {
    stderr.write("Error: Too many arguments provided for Tidal boot options\n");
    process.exit(1);
  }
  else {
    try{ fs.accessSync(withCustomTidalBoot, fs.F_OK); }
    catch (e) {
     stderr.write("Error: Tidal boot file does not exist\n");
     process.exit(1);
    }
  }
}

var child;
var tidal;
if(withTidal != null) {
    if(withTidalCabal != null) tidal = spawn('ghci', ['-XOverloadedStrings']);
    else tidal = spawn('stack',['ghci','--ghci-options','-XOverloadedStrings']);
    tidal.on('close', function (code) {
      stderr.write('Tidal process exited with code ' + code + "\n");
    });
    output = tidal.stdin;
    feedbackSource = tidal.stderr;
    tidal.stderr.addListener("data", function(m) {
      defaultFeedbackFunction(m.toString());
    });
    tidal.stdout.addListener("data", function(m) {
      defaultFeedbackFunction(m.toString());
    });
    var dotGhci;
    if(withCustomTidalBoot != null) { dotGhci = withCustomTidalBoot; }
    else if(withTidalVisuals == true) { dotGhci = ".ghciVisuals"; }
    else { dotGhci = ".ghciNoVisuals"; }
    fs.readFile(dotGhci,'utf8', function (err,data) {
      if (err) { console.log(err); return; }
      tidal.stdin.write(data);
      console.log("Tidal/GHCI initialized");
    });
    child = tidal;
}

//var child;
var foxdot;
if(withFoxDot != null) {
  foxdot = spawn('python',['-m','FoxDot', '-p']);
  foxdot.on('close', function (code) {
    stderr.write('FoxDot process exited with code ' + code + "\n");
  });
  output = foxdot.stdin;
  feedbackSource = foxdot.stderr;
  foxdot.stderr.addListener("data", function(m) {
    defaultFeedbackFunction(m.toString());
  });
  foxdot.stdout.addListener("data", function(m) {
    defaultFeedbackFunction(m.toString());
  });
  /*
  var dotFoxDot;
  if(withCustomFoxDotBoot != null) { dotFoxDot = withCustomFoxDotBoot; }
  else if(withFoxDotVisuals == true) { dotFoxDot = ".foxdotVisuals"; }
  else { dotFoxDot = ".foxdotNoVisuals"; }
  fs.readFile(dotFoxDot,'utf8', function (err,data) {
    if (err) { console.log(err); return; }
    foxdot.stdin.write(data);
    console.log("FoxDot initialized");
  });
  */
  child = foxdot;
}

function sanitizeStringForTidal(x) {
  var lines = x.split("\n");
  var result = "";
  var blockOpen = false;
  for(var n in lines) {
    var line = lines[n];
    var startsWithSpace = false;
    if(line[0] == " " || line[0] == "\t") startsWithSpace = true;
    if(blockOpen == false) {
      blockOpen = true;
      result = result + ":{\n" + line + "\n";
    }
    else if(startsWithSpace == false) {
      result = result + ":}\n:{\n" + line + "\n";
    }
    else if(startsWithSpace == true) {
      result = result + line + "\n";
    }
  }
  if(blockOpen == true) {
    result = result + ":}\n";
    blockOpen = false;
  }
  return result;
}

if(oscPort !=null) {
  stderr.write("extramuros: listening for OSC on UDP port " + oscPort);
  udp = new osc.UDPPort( { localAddress: "0.0.0.0",localPort: oscPort});
  udp.open();
}

var connectWs = function() {
    stderr.write("extramuros: connecting to " + wsAddress + "...\n");
    var ws = new WebSocket(wsAddress);
    var udp,oscFunction,feedbackFunction;

    send = function(o) {
      try {ws.send(JSON.stringify(o))}
      catch(e) {stderr.write("warning: exception in WebSocket send\n")}
    }

    oscFunction = function(m) {
      send({ 'request': 'oscFromClient', 'password' : password, 'address': m.address, 'args': m.args });
    }

    feedbackFunction = function(m) {
      send({'request': 'feedback','password' : password,'text': m.toString() });
    }

    ws.on('open',function() {
      stderr.write("extramuros: connected to " + wsAddress + "\n");
      if(oscPort !=null) {
        if(udp!=null) udp.on("message",oscFunction);
      }
      if(feedback != null) {
        if(child != null) {
          child.stderr.addListener("data",feedbackFunction);
          child.stdout.addListener("data",feedbackFunction);
        }
      }
    });

    ws.on('message',function(m) {
      var n = JSON.parse(m);
      if(n.type == 'eval') {
        var s = n.code;
        if(newlines) { // convert newline sequences to whitespace
            s = s.replace(/\n|\n\r|\r\n|\r/g," ");
        }
        else if(withTidal) {
          s = sanitizeStringForTidal(s);
        }
        if(sonicPi) {
          sonicPiTool = spawn('sonic-pi-tool', ['eval-stdin']);
          sonicPiTool.on('close', function (code) {
            stderr.write('sonic-pi-tool process exited with code ' + code + "\n");
          });
          sonicPiTool.stdin.end(s); // or write and then EOF some other way???
        }
        else if (withFoxDot) {
          output.write(s+"\n\n");
          stderr.write(s+"\n");
        }
        else {
          output.write(s+"\n");
          stderr.write(s+"\n");
        }
      }
    });

    ws.on('close',function() {
      stderr.write("extramuros: websocket connection " + wsAddress + " closed\n");
      if(udp!=null)udp.close();
      if(feedback != null) {
        if(child != null) {
          child.stderr.removeListener("data",feedbackFunction);
          child.stdout.removeListener("data",feedbackFunction)
        }
      }
      setTimeout(connectWs,5000);
    });

    ws.on('error',function() {
      // setTimeout(connectWs,5000);
    });
};

if(wsAddress != null) connectWs();

stdin.addListener("data", function (t) {
  output.write(t+"\n");
});

process.on('SIGINT', function() { /* sub.close(); */ ws.close(); } );
