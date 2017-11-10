var fs = require("fs"),
    path = require("path"),
    http = require("http"),
    https = require("https"),
    mime = require("mime"),
    Channel = require("./class/Channel"),
    Notify = require("./class/Notify"),
    Command = require("./class/Command"),
    deflate = require("permessage-deflate"),
    faye = require("faye");

var SHARED_DIR = __dirname + "/.",
    PUBLIC_DIR = SHARED_DIR + "/public",
    bayeux = new faye.NodeAdapter({ mount: "/bayeux", timeout: 20 }),
    channelControl = new Channel(),
    port = process.argv[2] || "8000",
    secure = process.argv[3] === "tls",
    key = null, //fs.readFileSync(SHARED_DIR + '/server.key'),
    cert = null; //fs.readFileSync(SHARED_DIR + '/server.crt');

var config = {
    endpoint: "http://localhost:8000/bayeux"
};

bayeux.addWebsocketExtension(deflate);

var handleRequest = function(request, response) {
    var path = request.url === "/" ? "/index.html" : request.url,
        isJS = path.substr(-2) == "js",
        configJS = "var ENDPOINT = '" + config.endpoint + "'\n";

    fs.readFile(PUBLIC_DIR + path, function(err, content) {
        var status = err ? 404 : 200;
        var contentResponse = isJS ? configJS : '';
        try {
            response.writeHead(status, { "Content-Type": mime.lookup(path) });
            response.end((contentResponse + content) || "Not found " + path);
        } catch (e) {
            console.log(e);
        }
    });
};

var server = secure
    ? https.createServer({ cert: cert, key: key }, handleRequest)
    : http.createServer(handleRequest);

bayeux.attach(server);
server.listen(Number(port));

bayeux.getClient().subscribe("/commands", function(message) {
    var commandResponse = Command.process(message.command);
});

bayeux.on("subscribe", function(clientId, channel) {
    channelControl.add(clientId, channel);
    bayeux.getClient().publish(channel, {
        type: 'notify',
        command: 'getCount',
        value: Command.process('Notify.getCount()')
    });
});

bayeux.on("unsubscribe", function(clientId, channel) {
    channelControl.remove(clientId);
});

bayeux.on("disconnect", function(clientId) {
    console.log("[ DISCONNECT] " + clientId);
});

console.log("Listening on " + port + (secure ? " (https)" : ""));
