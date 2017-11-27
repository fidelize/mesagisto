Notify = require("./Notify");

var Command =  {
    whiteList: [
        'Notify.getCount',
        'Notify.getAll',
    ],
    process: function (command) {
        var response = null;
        if (this.whiteList.indexOf(command) == -1) {
            return null;
        }

        eval("response = " + command + "();");
        return response;
    },
}

module.exports = Command;
