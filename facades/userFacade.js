var User = require("../models/user");

function getAllUsers() {
  return User.find({}).exec();
}

function addUser(firstName, lastName, userName, password, email) {
  return new User({ firstName, lastName, userName, password, email}).save();
}

function findByUsername(username) {
  return User.findOne({userName: username}).exec();
}

function findById(id) {
  return User.findById({ _id:id }).exec();
}

module.exports = {
  getAllUsers: getAllUsers,
  addUser: addUser,
  findByUsername: findByUsername,
  findById: findById,
}