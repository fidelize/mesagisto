var MESAGISTO_HOST = process.env.MESAGISTO_HOST;
var MESAGISTO_PORT = (process.env.PORT || process.env.MESAGISTO_PORT);
const config = {
    endpoint: "http://" + MESAGISTO_HOST + "/bayeux",
    publicDir: __dirname + "/public/",
    baseDir: __dirname + "/",
    port: MESAGISTO_PORT,
    secure: false
};

module.exports = config;
