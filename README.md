extramuros - language-neutral shared-buffer networked live coding system
==========

See install-osx.md for installation instructions.  See this document for usage.

Launch a server (one server per collaborative performance group, must be on an Internet location that all client machines can reach, i.e. a publicly reachable Internet address, this may require configuration of your router or network) as follows. Create a new terminal window and:
```
cd extramuros (change to the directory where you put extramuros)
node server.js password (launch the server process, replace password with a password that will be required in the web browser to play together)
```
Launch a test client or clients (one client per application instance (i.e. Tidal, sclang) that needs to get shared code from the server; you can have multiple clients on a single machine if you want, and you can have a server and a client on the same machine - probably best to put them in different terminal windows in that case though, for convenience). I suggest testing clients separately from a performance language (Tidal, SC) first. Create a new terminal window and:
```
cd extramuros (change to the directory where you put extramuros)
node client.js tcp://127.0.0.1:8001 (launch a client for testing, replace 127.0.0.1 with actual IP address if the server is running on a different machine than this one)
```
Launch a web browser and point it to the server as follows: 127.0.0.1:8001 (replace 127.0.0.1 with actual IP address if on a different machine)
Enter the chosen password in the interface that appears in the browser.
Enter some code into one of the text boxes and click "eval".
Go back to your client terminal window - you should see the code you entered appear there. If so, it's working and you can move onto connecting the client.js code to your performance language.
Press Ctrl-C twice to end the "node client.js" process so you can restart it.

If the test client from step #2 worked, then you're ready to launch a client piped into a SuperCollider session. In a terminal window:
```
cd /Applications/SuperCollider/SuperCollider.app/Contents/Resources/ (change to your SuperCollider app's Resources directory)
node ~/extramuros/client.js tcp://127.0.0.1:8001 | ./sclang (launch the client, piped to SuperCollider, replace 127.0.0.1 with server address if different machine)
```

Now in the web browser here's a simple test that it's working - enter the following in one of the browser page's text boxes:
```
Server.default = Server.internal.boot;
x = { SinOsc.ar(440,mul:0.05);}.play;
You won't have cmd-period to control your SC instance, so you can free the synth by evaluating x.free in a different text window.
```

All of this is rough, unfriendly and probably even mistaken in some cases. So let's all help make it better!...

-d0kt0r0
