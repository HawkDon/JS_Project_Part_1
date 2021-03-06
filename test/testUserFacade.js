const mongoose = require("mongoose");
const expect = require("chai").expect;
const dbSetup = require("..//dbSetup");

//https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};

var userFacade = require("../facades/userFacade");
var User = require("../models/user");

let connection = null;
describe("Testing the User Facade", function () {

  /* Connect to the TEST-DATABASE */
  before(async function () {
    this.timeout(require("../settings").MOCHA_TEST_TIMEOUT);
    await dbSetup(require("../settings").DEV_DB_URI);
  })

  after(function () {
    mongoose.connection.close();
  })
  
  var users = [];
  /* Setup the database in a known state (2 users) before EACH test */
  beforeEach(async function () {
    await User.deleteMany({}).exec();
    users = await Promise.all([
      new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test", email: "a@b.dk" }).save(),
      new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test", email: "b@b.dk" }).save(),
      new User({ firstName: "Brian", lastName: "Mortensen", userName: "bm", password: "test", email: "c@c.dk" }).save(),
    ])
  })

  it("Should find all users (Kurt and Hanne)", async function () {
    var users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(3);
  });

  it("Should Find Kurt Wonnegut by Username", async function () {
    var user = await userFacade.findByUsername("kw");
    expect(user[0].firstName).to.be.equal("Kurt");
  });

  it("Should Find Kurt Wonnegut by ID", async function () {
    var user = await userFacade.findById(users[0]._id);
    expect(user.firstName).to.be.equal("Kurt");
  });

  it("Should add Peter Pan", async function () {
    var user = await userFacade.addUser("Peter", "Pan", "peter", "test", "a@b.dk");
    expect(user).to.not.be.null;
    expect(user.firstName).to.be.equal("Peter");
    var users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(4);
  });

  it("Should update firstname Kurt to Jan", async function () {
    var user = await userFacade.findByUsername("kw");
    var ourUser = user[0];
    ourUser.firstName = "Jan";
    var updatedUser = await userFacade.updateUserTest(ourUser);
    expect(updatedUser.firstName).to.be.equal("Jan");
  })

  it("Delete user with id", async function () {
    var user = await userFacade.findByUsername("bm");
    var response = await userFacade.deleteUser(user[0]._id);
    var getAllUsers = await userFacade.getAllUsers();
    expect(getAllUsers.length).to.be.equal(2);
  })
})