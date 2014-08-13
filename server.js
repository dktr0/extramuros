
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
} catch (e) {}

var port = 8000;
var password = process.argv[2];
console.log("Shared buffer server by David Ogborn using sharejs v" + sharejs.version);
console.log("password is: " + password);
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

server.get('/?', function(req, res, next) {
  res.writeHead(302, {location: '/index.html'});
  res.end();
});
server.listen(port);
console.log("Listening on port " + port + " for HTTP");

process.title = 'shared-buffer-server';
process.on('SIGINT',function() { pub.close(); });

