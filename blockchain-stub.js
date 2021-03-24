const _ = require('lodash');

class StubbedBC {

    constructor() {

        this.eventHandlers = [];
        this.timer = setInterval(function() {
            _.each(this.eventHandlers, function(handler) {
                handler(new PeerUpdateEvent(0, 0, {host:'localhost', port:0}));
            });
        }, 1000);
    }

    register(eventHandler) {
        this.eventHandlers.push(eventHandler);
    }
}

module.exports = StubbedBC;