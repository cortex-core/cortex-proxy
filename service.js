const net = require('net');
const stun = require('node-stun');
const block_chain = require('./blockchain-stub');

const MASTER_PORT = 7077;
const REMOTE_PORT = 3478; // STUN
const REMOTE_ADDR = "127.0.0.1";
const LOCAL_ADDR = "3668-bturgut";

let downstream;

let upstream = new net.Socket();

let isMaster;

var client = stun.createClient();
client.setServerAddr(REMOTE_ADDR, REMOTE_PORT);

let downstreamEndPoint = net.createServer(function(socket) {
    socket.on('data', function (msg) {
        if (isMaster == undefined) {
            isMaster = false;
            downstream = socket;
        }
        if (isMaster == false) {
            upstream.write(msg);
        }
    });
});

client.start(function (result) {
    if (result == -1) {
        return;
    }

    let mapped = client.getMappedAddr();

    upstream.connect(REMOTE_PORT, REMOTE_ADDR, function () {
        console.log("CONNECTED TO SERVER...");
        upstream.on("data", function (data) {
            if (isMaster == undefined) {
                isMaster = true;
                downstream = new net.Socket();
                downstream.connect(MASTER_PORT, LOCAL_ADDR, function () {
                    downstream.on('data', function (msg) {
                        upstream.write(msg);
                    });
                });
            }
            downstream.write(data);
        });
        downstreamEndPoint.listen(0);
        console.log("sbin/start-slave.sh spark://" + LOCAL_ADDR + ":"+ downstreamEndPoint.address().port);
    });
});
