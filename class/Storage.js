const config = require("../config");
const fs = require("fs");
var glob = require("glob")

class Storage {
    constructor() {
        this.storagePath = 'storage';
        this.fullStoragePath = config.baseDir + '/' +  this.storagePath;
        this.createDirectoryIfNotExists(this.fullStoragePath);
    }

    createDirectoryIfNotExists(dir) {
        try {
            let dirLocated = fs.statSync(dir);
            if (dirLocated.isDirectory()) {
                return true;
            }
        } catch (err) {
            console.log('directory ' + dir + ' not found');
        }
        fs.mkdirSync(dir);
        return true;
    }

    save(channel, message) {
        let dir = config.baseDir + 'storage';
        let fileName = message.id + channel.replace(/\//g, "_") + ".msg";
        fs.writeFile(dir + '/' + fileName, JSON.stringify(message));
    }

    getAllFromChannel(channel) {
        var self = this;
        return  new Promise( function(resolve, reject) {
            let channelFile = channel.replace(/\//g, "_");
            let mask = self.fullStoragePath + '/*' + channelFile + '*.msg';
            glob(mask, {}, function (er, files) {
                let messages = [];
                for (var x = 0; x < files.length; x++) {
                    let message = JSON.parse(fs.readFileSync(files[x], "utf8"));
                    if (message.expire < Date.now()) {
                        continue;
                    };
                    messages.push({date: message.date, content: message.content});
                }
                messages.sort(function (valor1, valor2) {
                    return (valor1.date > valor2.date) ? -1 : 1;
                })
                resolve(messages);
            })
        });
    }

    getCountFromChannel(channel) {
        var self = this;
        return  new Promise( function(resolve, reject) {
            self.getAllFromChannel(channel).then((messages) => {
                resolve(messages.length);
            });
        });
    }
}

module.exports = Storage;
