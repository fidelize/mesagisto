Notify = {
    elements: {
        counter: "#notify-counter",
        emptyNotices: '#empty-notices',
        hasNotices: '#has-notices',
    },
    username: null,
    channel: 'global',
    _bayeux: null,
    _endPoint: ENDPOINT,
    _totalMessages: 0,
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
        this._bayeux.subscribe(fullChannel, function (message) {self.onMessage(message)});
        this._bayeux.publish("/commands", {
            command: "Notify.getCount",
            channel: fullChannel
        })
        this.hideElements();
    },

    hideElements: function () {
        try {
            document.querySelector(this.elements.counter).style.display = "none";
            document.querySelector(this.elements.emptyNotices).style.display = "none"
            document.querySelector(this.elements.hasNotices).style.display = "none"
        } catch (err) {
            console.log(err);
        }
    },

    showCount: function (count) {
        if (this._totalMessages <= 0) {
            document.querySelector(this.elements.emptyNotices).style.display = "";
        }
        document.querySelector(this.elements.hasNotices).style.display = "";
        document.querySelector(this.elements.counter).style.display = "";
        document.querySelector(this.elements.counter).innerHTML = this._totalMessages;
        return true

    },

    onCommandResponse: function (message) {
        if (message.command == 'Notify.getCount') {
            this._totalMessages = parseInt(message.value);
            this.showCount();
            return true;
        }
    },

    onMessage: function (message) {
        if (message.type == 'command') {
            this.onCommandResponse(message);
        }
        console.log(message);
    },
};
