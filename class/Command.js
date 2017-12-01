Notify = require("./Notify");

var Command =  {
    whiteList: [
        'Notify.getCount',
        'Notify.getAll',
    ],
    process: function (command,  message, bayeux) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var response = null;
            if (self.whiteList.indexOf(command) == -1) {
                return null;
            }

            eval("response = " + command + "(message, bayeux);");
            response.then(function (value) {
                resolve(value);
            });
        })


    },
}

module.exports = Command;
