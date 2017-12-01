var MESAGISTO_HOST = process.env.MESAGISTO_HOST;
const config = {
    endpoint: "http://" + MESAGISTO_HOST + "/bayeux",
    publicDir: __dirname + "/public/",
    baseDir: __dirname + "/"
};

module.exports = config;
