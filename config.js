var MESAGISTO_HOST = process.env.MESAGISTO_HOST;
var MESAGISTO_PORT = process.env.MESAGISTO_PORT;
const config = {
    endpoint: "http://" + MESAGISTO_HOST + ":" + MESAGISTO_PORT +  "/bayeux",
    publicDir: __dirname + "/public/",
    baseDir: __dirname + "/",
    port: MESAGISTO_PORT,
    secure: false
};

module.exports = config;
