var MESAGISTO_HOST = process.env.MESAGISTO_HOST;
var MESAGISTO_PORT = (process.env.PORT || process.env.MESAGISTO_PORT);
var MESAGISTO_SECURE = process.env.MESAGISTO_SECURE;
var MESAGISTO_CERT_PATH = process.env.MESAGISTO_CERT_PATH;

const config = {
    endpoint: MESAGISTO_HOST + "/bayeux",
    publicDir: __dirname + "/public/",
    baseDir: __dirname + "/",
    port: MESAGISTO_PORT,
    secure: (MESAGISTO_SECURE == 'true'),
    certPath: MESAGISTO_CERT_PATH
};

module.exports = config;
