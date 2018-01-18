const config = require("../config");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
var qs = require('querystring');

class HttpServer {
    constructor(manager, channelControl) {
        this.body = null;
        this.contentType = null;
        this.response = null;
        this.messageManager = manager;
        this.channelControl = channelControl;
    }

    errorResponse(message) {
        try {
            this.response.writeHead(500, {
                "Content-Type": "application/json"
            });
            this.response.end(JSON.stringify({
                message: message
            }));
        } catch (e) {
            console.log(e);
        }
    }

    successResponse(message) {
        try {
            this.response.writeHead(200, {
                "Content-Type": "application/json"
            });
            this.response.end(JSON.stringify({
                message: message
            }));
        } catch (e) {
            console.log(e);
        }
    }

    parseContent() {
        try {
            return JSON.parse(this.body)
        } catch (err) {
            return false;
        }
    }

    publishMessage() {
        if (!this.body) {
            this.errorResponse('no data content');
            return false;
        }

        if (this.contentType !== 'application/json') {
            this.errorResponse('invalid content-type ' + this.contentType);
            return false;
        }

        var message = this.parseContent();
        if (!message) {
            this.errorResponse('invalid content data');
            return false;
        }

        this.messageManager.publish(message.channel, {
            type: message.type,
            content: message.content
        });

        if (typeof this.channelControl.cacheTotalNotify[message.channel] == 'undefined') {
            this.channelControl.cacheTotalNotify[message.channel] = 0;
        }
        this.channelControl.cacheTotalNotify[message.channel]++

        this.successResponse('Message sent');
    }

    openFile(path) {
        var self = this;
        let isJS = path.substr(-2) == "js";
        let configJS = "var ENDPOINT = '" + config.endpoint + "'\n";
        fs.readFile(config.publicDir + path, function(err, content) {
            var status = err ? 404 : 200;
            var contentResponse = isJS ? configJS : "";
            try {
                self.response.writeHead(status, {
                    "Content-Type": mime.lookup(path)
                });
                self.response.end(
                    contentResponse + content || "Not found " + path
                );
            } catch (e) {
                console.log(e);
            }
        });
    }

    isInternal(path) {
        const internalPath = [
            "/publish"
        ];
        return internalPath.indexOf(path) >= 0;
    }

    internalProcess(path) {
        if (path == '/publish') {
            this.publishMessage();
            return;
        }
    }

    handleRequest() {
        var self = this;
        return function(request, response) {
            var body = '';
            var path = request.url === "/" ? "/index.html" : request.url;
            self.contentType = request.headers['content-type'];
            self.response = response;

            request.on('data', function (data) {
                body += data;
            });

            request.on('end', function () {
                let time = Date.now();
                self.body = body;
                if (self.isInternal(path)) {
                    self.internalProcess(path);
                    return;
                }
                self.openFile(path);
            });
        };
    }
}

module.exports = HttpServer;
