var net = require('net');

var PORT = 4040;

var dummyEndPoint = net.createServer().listen(PORT);

let socks = [];

dummyEndPoint.on('connection', function (sock) {
    socks.push(sock);
    if (socks.length == 2) {
        socks[0].on('data', function(msg) {
            socks[1].write(msg);
        });
        socks[1].on('data', function(msg) {
            socks[0].write(msg);
        });
    }
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
});

console.log("Dummy Server is running on:: " + PORT);