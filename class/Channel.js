var Command = require("./Command");

var Channel = function () {
    this.channels = [];
    this.bayeux = null;
    this.cacheTotalNotify = {};
    this.add = function (clientId, channel) {
        this.channels.push({
            channel: channel,
            clientId: clientId
        });
    }

    this.remove = function (clientId) {
        for (var x = 0; x < this.channels.length; x++) {
            if (this.channels[x].clientId == clientId) {
                this.channels.splice(x, 1);
                break;
            }
        }
    }

    this.onSubscibeChannel = function(channel) {
        var self = this;
        if (channel.split('/')[1] == 'notify') {
            if (typeof this.cacheTotalNotify[channel] != 'undefined') {
                self.bayeux.getClient().publish(channel, {
                    type: 'command',
                    command: "Notify.getCount",
                    value: self.cacheTotalNotify[channel]
                });
                return true;
            }
            Command.process("Notify.getCount", {channel: channel}, self.bayeux).then(function (commandResponse) {
                self.cacheTotalNotify[channel] = commandResponse;
                self.bayeux.getClient().publish(channel, {
                    type: 'command',
                    command: "Notify.getCount",
                    value: commandResponse
                });
            });
        }
    }

    this.onUnsubscibeChannel = function(channel) {
    }
}

module.exports = Channel;
