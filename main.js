//Standard libs.
var fs = require("fs");
var path = require("path");

//Web3.
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider(settings.infura));

//Start loading the modules. If this done outside of the top-level, a segfault occurs.
var TuneTrader = import("./ModulesX/TuneTrader.mjs");

//Site libs.
var express = require("express");
var helmet = require("helmet");

//Settings.
var settings = require("./settings.json");

//Paths.
var paths = {
    modules: path.join(__dirname, "ModulesX"),
    public: path.join(__dirname, "FrontendX"),
    index: path.join(__dirname, "FrontendX", "index.html"),
    fourOhFor: path.join(__dirname, "FrontendX", "404.html")
};

//Error fix.
async function errorFix(err, req, res, next) {
    try {
        if (res.headersSent) {
            return next(err);
        }
    } catch(e) {
        console.log(e);
    }
}

(async () => {
    //Await the Module loads.
    TuneTrader = new ((await TuneTrader)["default"])(web3, "0xed134BC41B05511eA177F5b536d4975C2E844C5C");

    //Create the server.
    require("https").createServer(
        {
            key: fs.readFileSync(settings.ssl.key),
            cert: fs.readFileSync(settings.ssl.cert)
        },
        express()
        //Disable etag.
        .set("etag", false)
        //Various security options.
        .use(helmet({
            csp: {
                defaultSrc: ["'self'", 'unsafe-inline'],
                upgradeInsecureRequests: true
            },
            referrerPolicy: {
                policy: "same-origin"
            },
            expectCt: {
                enforce: true
            }
        }))
        //Serve the Modules.
        .use("/modules/", express.static(paths.modules))
        //Serve the site.
        .use("/", express.static(paths.public))
        //Serve the index.
        .get("*", async (req, res) => {
            res.sendFile(paths.fourOhFour);
        })
        //Handle errors.
        .use(errorFix)
    ).listen(443, "0.0.0.0");

    //Add a HTTP redirect.
    require("http").createServer(
        express()
        //Disable etag.
        .set("etag", false)
        //various security options.
        .use(helmet({
            hsts: false,
            expectCt: false,
            csp: {
                defaultSrc: ["'self'", 'unsafe-inline'],
                upgradeInsecureRequests: true
            },
            referrerPolicy: {
                policy: "same-origin"
            },
        }))
        //Serve the index.
        .get("*", async (req, res) => {
            res.redirect("https://tunetrade.io" + req.originalUrl);
        })
        //Handle errors.
        .use(errorFix)
    ).listen(80, "0.0.0.0");
})();
