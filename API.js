//Express.
var express = require("express");

//Start loading the modules
//If this done outside of the top-level, a segfault occurs.
var TuneTrader = import("./ModulesX/TuneTrader.mjs");

//Web3.
var Web3 = require("web3");

module.exports = async (settings) => {
    //Init Web3.
    var web3 = new Web3(new Web3.providers.HttpProvider(settings.infura));

    //Await the Module loads.
    TuneTrader = new ((await TuneTrader)["default"])(web3, "0xed134BC41B05511eA177F5b536d4975C2E844C5C");

    //Create the Router.
    var router = express.Router()
        .get("/tokenInformation", async (req, res) => {
            res.end(
                JSON.stringify({
                    address: await TuneTrader.getTXTTokenAddress(),
                    decimals: 0,
                    totalSupply: 0,
                    holders: 0
                })
            );
        })
        .get("/balance", async (req, res) => {

        })
        .get("/creators", async (req, res) => {

        })
        .get("/creatorInformation", async (req, res) => {

        })
        .get("/tokenBalance", async (req, res) => {

        })
        .get("/crowdsaleInformation", async (req, res) => {

        })
        .get("/picture", async (req, res) => {

        })
        .post("/uploadPicture", async (req, res) => {

        });
    return router;
}
