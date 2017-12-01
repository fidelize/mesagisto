const Storage = require("./Storage");

class Message {
    constructor(bayeux, channels) {
        this.bayeux = bayeux;
        this.channels = channels;
        this.storage = new Storage();
    }

    newUuid() {
        var d = new Date().getTime();
        if (
            typeof performance !== "undefined" &&
            typeof performance.now === "function"
        ) {
            d += performance.now(); //use high-precision timer if available
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
            c
        ) {
            var r = ((d + Math.random() * 16) % 16) | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
    }

    publish(channel, message) {
        if (message.type == 'newNotification') {
            message.id = this.newUuid();
            message.expire = Date.now() + (100 * 60 * 60 * 24 * 7);
            message.date = (new Date());
        }
        this.storage.save(channel, message);
        this.bayeux.getClient().publish(channel, message);
    }
}

module.exports = Message;
