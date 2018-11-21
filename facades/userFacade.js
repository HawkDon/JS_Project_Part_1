var User = require("../models/User");

function getAllUsers() {
  return User.find({}).exec();
}

function addUser(firstName, lastName, userName, password, email) {
  return new User({ firstName, lastName, userName, password, email }).save().catch(res => false);
}

function findByUsername(username, next) {
  return User.find({ userName: username }, function (err, res) {
    if (err) console.log(err);
    if (!res.length) {
      next({hasError: true});
    }
  });
}

function findById(id) {
  return User.findById({ _id: id }).exec();
}

module.exports = {
  getAllUsers: getAllUsers,
  addUser: addUser,
  findByUsername: findByUsername,
  findById: findById,
}