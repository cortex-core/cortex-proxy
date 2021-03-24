const BCEvent = require('./BCEvent');

class PeerUpdateEvent extends BCEvent{

    constructor(id, peer, data) {
        super(id);
        this.peer = peer;
        this.data = data;
    }
}

module.exports = PeerUpdateEvent;