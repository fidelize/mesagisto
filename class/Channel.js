var Channel = function () {
    this.channels = [];
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
}

module.exports = Channel;
