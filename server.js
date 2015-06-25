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

// Lets try and enable redis persistance if redis is installed...
try {
  require('redis');
  options.db = {type: 'redis'};
} catch (e) {
    console.log("redis not available");
}

var WebSocket = require('ws');
var osc = require('osc');
var wss = new WebSocket.Server({port: 1337});
var udp = new osc.UDPPort( {
    localAddress: "0.0.0.0",
    localPort: 7772
});

udp.on("message",function(m) {
    console.log(m.address,m.args);
});

wss.on('connection',function(ws) {
    udp.addListener("message",function(m) {
	var n = {
	    'type': 'osc',
	    'address': m.address,
	    'args': m.args
	};
	ws.send(JSON.stringify(n));
    });
});

udp.open();

var port = 8000;
var password = process.argv[2];
console.log("extramuros");
console.log(" using sharejs v" + sharejs.version);
console.log(" password is: " + password);
// Attach the sharejs REST and Socket.io interfaces to the server
var shareserver = sharejs.server.attach(server, options);

function publishCode(id,res) {
  sharejs.client.open(id,'text','http://127.0.0.1:' + port + '/channel', function (err,doc) {
    console.log(doc.getText());
    pub.send(doc.getText());
  });
  res.writeHead(303, {location: '/index.html'});
  res.write('');
  res.end();
}

server.post('/eval1-'+password, function(req, res, next) { publishCode('edit1',res); });
server.post('/eval2-'+password, function(req, res, next) { publishCode('edit2',res); });
server.post('/eval3-'+password, function(req, res, next) { publishCode('edit3',res); });
server.post('/eval4-'+password, function(req, res, next) { publishCode('edit4',res); });
server.post('/eval5-'+password, function(req, res, next) { publishCode('edit5',res); });
server.post('/eval6-'+password, function(req, res, next) { publishCode('edit6',res); });
server.post('/eval7-'+password, function(req, res, next) { publishCode('edit7',res); });
server.post('/eval8-'+password, function(req, res, next) { publishCode('edit8',res); });
server.post('/eval9-'+password, function(req, res, next) { publishCode('edit9',res); });

server.get('/?', function(req, res, next) {
  res.writeHead(302, {location: '/index.html'});
  res.end();
});
server.listen(port);
console.log("Listening on port " + port + " for HTTP");

process.title = 'shared-buffer-server';
process.on('SIGINT',function() { pub.close(); });

