Notify = {
    elements: {
        counter: "#notify-counter",
        emptyNotices: '#empty-notices',
        hasNotices: '#has-notices',
        noticesBox: '#notices-box',
        noticesContent: '#notices-content'
    },
    token: "token_undefined",
    username: null,
    channel: 'global',
    _bayeux: null,
    _endPoint: ENDPOINT,
    _totalMessages: 0,
    _fullChannel: null,
    init: function() {
        var self = this;
        this._fullChannel = "/notify/"
            + this.channel + "/"
            + this.token;

        if (typeof Faye == undefined) {
            console.error("Faye not initialized");
            return false;
        }

        if (!this.username) {
            console.error("Username empty!!!");
            return false;
        }

        document.querySelector(this.elements.hasNotices).onclick = function () {
            self.commandGetNotifications();
        };
        document.querySelector(this.elements.counter).onclick = function () {
            self.commandGetNotifications();
        };
        window.setTimeout(function () {
            self._bayeux = new Faye.Client(self._endPoint);
            self._bayeux.subscribe(self._fullChannel, function (message) {
                self.onMessage(message)
            });
        }, 100);
        this.hideElements();
    },
    commandGetNotifications: function () {
        if (document.querySelector(this.elements.noticesBox).style.display == 'none') {
            document.querySelector(this.elements.noticesBox).style.display == ''
            this._bayeux.publish("/commands", {
                command: "Notify.getAll",
                channel: this._fullChannel
            });
            return;
        }

        document.querySelector(this.elements.noticesBox).style.display = 'none';
    },
    hideElements: function () {
        try {
            document.querySelector(this.elements.counter).style.display = "none";
            document.querySelector(this.elements.emptyNotices).style.display = "none";
            document.querySelector(this.elements.hasNotices).style.display = "none";
            document.querySelector(this.elements.noticesBox).style.display = "none";
        } catch (err) {
            console.log(err);
        }
    },
    showBoxElements: function () {
        try {
            document.querySelector(this.elements.noticesBox).style.display = "";
            document.querySelector(this.elements.noticesContent).style.display = "";
        } catch (err) {
            console.log(err);
        }
    },
    hideBoxElements: function () {
        try {
            document.querySelector(this.elements.noticesBox).style.display = "none";
            document.querySelector(this.elements.noticesContent).style.display = "none";
        } catch (err) {
            console.log(err);
        }
    },
    showCount: function (count) {
        this.hideElements();
        if (this._totalMessages <= 0) {
            document.querySelector(this.elements.emptyNotices).style.display = "";
            return true;
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
    onNewNotification(message) {
        this._totalMessages++;
        this.showCount(this._totalMessages);

        if (!("Notification" in window)) {
            return false;
        } else if (Notification.permission !== "granted") {
            Notification.requestPermission();
            return true;
        }
        new Notification(message.content);
        return true;
    },
    onMessage: function (message) {
        if (message.type == 'command') {
            this.onCommandResponse(message);
        }
        if (message.type == 'newNotification') {
            this.onNewNotification(message);
        }
        if (message.type == 'showNotifications') {
            this.showNotices(message);
        }
    },
    showNotices: function (message) {
        if (!message.content || message.content.length == 0) {
            this.hideBoxElements();
            return ;
        }
        var htmlNotices = "";
        this.showBoxElements();
        for (var x = 0; x < message.content.length; x++) {
            messageContent = message.content[x].content;
            messageContent = messageContent.replace(new RegExp("\n",'g'), "<br/>");
            htmlNotices += '<div class="notice-item">'
            + '<span class="notice-message">' + messageContent + '</span>'
            + '</div>'
        }
        document.querySelector(this.elements.noticesContent).innerHTML = htmlNotices;
    }
};
