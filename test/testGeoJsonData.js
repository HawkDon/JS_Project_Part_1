//This is for you to do
const mongoose = require("mongoose");
const expect = require("chai").expect;
const dbSetup = require("..//dbSetup");

//https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};

var posFacade = require("../facades/posFacade");
var Position = require("../models/Position");

let connection = null;
describe("Testing the posFacade", function () {

    /* Connect to the TEST-DATABASE */
    before(async function () {
        this.timeout(require("../settings").MOCHA_TEST_TIMEOUT);
        await dbSetup(require("../settings").DEV_DB_URI);
    })

    after(function () {
        mongoose.connection.close();
    })

    beforeEach(async function () {
        await Position.deleteMany({}).exec();
        positions = await Promise.all([
            new Position({ user: "5c2f6745ab7ea81aa4d709a8", loc: { coordinates:  [12.699508666992188, 55.75609988084715] } }).save(),
            new Position({ user: "5c2f6745ab7ea81aa4d709a8", loc: { coordinates:  [12.404251098632812, 55.75648626598077] } }).save(),
            new Position({ user: "5c2f6745ab7ea81aa4d709a8", loc: { coordinates:  [12.385025024414062, 55.575239380091226] } }).save(),
            new Position({ user: "5c2f6745ab7ea81aa4d709a8", loc: { coordinates:  [12.70362854003906, 55.56863981896112] } }).save(),
            new Position({ user: "5c2f6745ab7ea81aa4d709a8", loc: { coordinates:  [12.699508666992188, 55.75609988084715] } }).save()
        ])
    })

    it("Should find all Kurts positions", async function () {
        var positions = await posFacade.findAllPositionForUser("5c2f6745ab7ea81aa4d709a8");
        expect(positions.length).is.to.be.equal(5);
    });
})