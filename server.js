var http = require("http"),
    https = require("https"),
    Channel = require("./class/Channel"),
    HttpServer = require("./class/HttpServer"),
    Command = require("./class/Command"),
    MessageManager = require("./class/Message"),
    Storage = require("./class/Storage"),
    deflate = require("permessage-deflate"),
    faye = require("faye");

var bayeux = new faye.NodeAdapter({ mount: "/bayeux", timeout: 20 }),
    port = process.argv[2] || "8000",
    secure = process.argv[3] === "tls",
    key = null, //fs.readFileSync(SHARED_DIR + '/server.key'),
    cert = null; //fs.readFileSync(SHARED_DIR + '/server.crt');


bayeux.addWebsocketExtension(deflate);

var storage = new Storage();
var channelControl = new Channel();
var messageManager = new MessageManager(bayeux, channelControl);
var httpServer = new HttpServer(messageManager, channelControl);

var handleRequest = httpServer.handleRequest();

var server = secure
    ? https.createServer({ cert: cert, key: key }, handleRequest)
    : http.createServer(handleRequest);

bayeux.attach(server);
server.listen(Number(port));

bayeux.getClient().subscribe("/commands", function(message) {
    try {
        Command.process(message.command, message, bayeux).then(function (commandResponse) {
            bayeux.getClient().publish(message.channel, {
                type: 'command',
                command: message.command,
                value: commandResponse
            });
        });
    } catch (err) {
        console.error(err)
    }
});
channelControl.bayeux = bayeux;

bayeux.on("subscribe", function(clientId, channel) {
    console.log(channel);
    channelControl.add(clientId, channel);
    channelControl.onSubscibeChannel(channel);
});

bayeux.on("unsubscribe", function(clientId, channel) {
    channelControl.remove(clientId);
    channelControl.onUnsubscibeChannel(channel);

});

bayeux.on("disconnect", function(clientId) {
});

console.log("Listening on " + port + (secure ? " (https)" : ""));
