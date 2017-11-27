var http = require("http"),
    https = require("https"),
    Channel = require("./class/Channel"),
    HttpServer = require("./class/HttpServer"),
    Command = require("./class/Command"),
    deflate = require("permessage-deflate"),
    faye = require("faye");

var bayeux = new faye.NodeAdapter({ mount: "/bayeux", timeout: 20 }),
    channelControl = new Channel(),
    port = process.argv[2] || "8000",
    secure = process.argv[3] === "tls",
    key = null, //fs.readFileSync(SHARED_DIR + '/server.key'),
    cert = null; //fs.readFileSync(SHARED_DIR + '/server.crt');



bayeux.addWebsocketExtension(deflate);

const httpServer = new HttpServer();
httpServer.setBayeux(bayeux);
var handleRequest = httpServer.handleRequest();

var server = secure
    ? https.createServer({ cert: cert, key: key }, handleRequest)
    : http.createServer(handleRequest);

bayeux.attach(server);
server.listen(Number(port));

bayeux.getClient().subscribe("/commands", function(message) {
    var commandResponse = null;
    try {
        commandResponse = Command.process(message.command);
    } catch (err) {
        console.error(err)
    }
    bayeux.getClient().publish(message.channel, {
        type: 'command',
        command: message.command,
        value: commandResponse
    });
});

bayeux.on("subscribe", function(clientId, channel) {
    console.log(channel);
    channelControl.add(clientId, channel);
});

bayeux.on("unsubscribe", function(clientId, channel) {
    channelControl.remove(clientId);
});

bayeux.on("disconnect", function(clientId) {
    console.log("[ DISCONNECT] " + clientId);
});

console.log("Listening on " + port + (secure ? " (https)" : ""));
