Notify = {
    elements: {
        counter: "#notify-counter",
    },
    username: null,
    channel: 'global',
    _bayeux: null,
    _endPoint: ENDPOINT,
    init: function() {
        var self = this,
            fullChannel = "/notify/" + this.channel + "/" + this.username;

        if (typeof Faye == undefined) {
            console.error("Faye not initialized");
            return false;
        }

        if (!this.username) {
            console.error("Username empty!!!");
            return false;
        }

        this._bayeux = new Faye.Client(this._endPoint);
        this._bayeux.subscribe(fullChannel, this.onMessage);
        this._bayeux.publish("/commands", {
            command: "Notify.getCount",
            channel: fullChannel
        })

    },

    onMessage: function (message) {
        console.log(message);
    },
};
