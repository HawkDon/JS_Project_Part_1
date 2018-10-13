//This is for you to do
const mongoose = require("mongoose");
const expect = require("chai").expect;
const dbSetup = require("..//dbSetup");

//https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};

var blogFacade = require("../facades/blogFacade");
var userFacade = require('../facades/userFacade');
var LocationBlog = require("../models/LocationBlog");
var User = require('../models/User');

let connection = null;
describe("Testing the BlogFacade", function () {

  /* Connect to the TEST-DATABASE */
  before(async function () {
    this.timeout(require("../settings").MOCHA_TEST_TIMEOUT);
    await dbSetup(require("../settings").TEST_DB_URI);
  })

  after(function () {
    mongoose.connection.close();
  })

  beforeEach(async function () {
    await LocationBlog.deleteMany({}).exec();
    locationblog = await Promise.all([
      new LocationBlog({ info: "About hobbies", pos: {longitude: 100, latitude: 60}, author: new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test", email: "a@b.dk" }) }).save(),
      new LocationBlog({ info: "About food", pos: {longitude: 100, latitude: 60}, author: new User({ firstName: "Sarah", lastName: "Wonnegut", userName: "sh", password: "test", email: "b@b.dk" }) }).save(),
    ])
  })

  it("Should add a location blog", async function () {
    var user = new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test", email: "h@b.dk" });
    var locationblog = await blogFacade.addLocationBlog("About diseases", 200, 100, user);
    expect(locationblog).to.be.not.null;
    expect(locationblog.info).to.be.equal("About diseases");
    // Check if locationBlog exists in database
    var locationBlogFromDatabase = await blogFacade.findLocationBlog("About diseases");
    expect(locationBlogFromDatabase).to.be.not.null;
  });

  it("Should add a like to LocationBlog", async function () {
    var user = await userFacade.findByUsername("kw");
    var locationBlog = await blogFacade.findLocationBlog('About food');
    var locationUpdate = await blogFacade.likeLocationBlogUpdate(locationBlog, user)
    expect(locationUpdate.likedBy.length).to.be.equal(1);
  });
  
})