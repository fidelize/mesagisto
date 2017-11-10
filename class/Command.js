var Notify = require("./Notify");

var Command =  {
    whiteList: [
        'Notify.getCount',
        'Notify.getAll',
    ],
    process: function (command) {
        var resposnse = null;
        if (this.whiteList.indexOf(command) == -1) {
            return null;
        }

        eval("resposnse = " + command);
        return resposnse;
    },
}

module.exports = Command;
