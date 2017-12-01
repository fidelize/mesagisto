const Storage = require("./Storage");

var Notify =  {
    getCount: function (params) {
        return new Promise(function (resolve, rejected) {
            (new Storage).getCountFromChannel(params.channel).then(function (total) {
                resolve(total);
            });
        })
    },
    getAll: function (params, bayeux) {
        return new Promise(function (resolve, rejected) {
            (new Storage).getAllFromChannel(params.channel).then(function (messages) {
                let messageToResponse = [];
                for (var x = 0; x < messages.length; x++) {
                    messageToResponse.push(messages[x]);
                }
                bayeux.getClient().publish(params.channel, {
                    type: "showNotifications",
                	content: messageToResponse
                });
                resolve(true);
            });
        })
    },

}

module.exports = Notify;
