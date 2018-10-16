const https = require("https");
const fs = require("fs");

const options = {
    hostname: "api.hel.fi/linkedevents/v1",
    port: 443,
    path: "/event/47794",
    method: "GET"
};

const req = https.request(options, callback);