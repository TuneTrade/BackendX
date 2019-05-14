//Standard libs.
var fs = require("fs");
var path = require("path");

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
    fourOhFour: path.join(__dirname, "FrontendX", "public", "index.html")
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
    var api = await (require("./API.js"))(settings);

    //Create the server.
    var backend = express()
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
        //Use a Router for the API.
        .use("/api", api)
        //Serve the Modules.
        .use("/modules", express.static(paths.modules))
        //Serve the site.
        .use("/", express.static(paths.public))
        //Serve the 404 page.
        .get("*", async (req, res) => {
            res.status(404);
            res.sendFile(paths.fourOhFour);
        })
        //Handle errors.
        .use(errorFix);

    if (settings.httpOnly) {
        require("http").createServer(backend).listen(settings.ports.http, "0.0.0.0");
        return;
    }

    require("https").createServer(
        {
            key: fs.readFileSync(settings.ssl.key),
            cert: fs.readFileSync(settings.ssl.cert)
        },
        backend
    ).listen(settings.ports.https, "0.0.0.0");

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
    ).listen(settings.ports.http, "0.0.0.0");
})();
