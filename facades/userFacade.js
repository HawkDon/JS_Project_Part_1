var User = require("../models/User");

function getAllUsers() {
  return User.find({}).exec();
}

function addUser(firstName, lastName, userName, password, email) {
  return new User({ firstName, lastName, userName, password, email }).save().catch(res => false);
}

function findByUsername(username, next) {
  return User.find({ userName: username });
}

function findById(id) {
  return User.findById({ _id: id }).exec();
}

//Ekstra for graphql mutations

function addUserGraphql(user) {
  return new User({
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
    email: user.email,
    job: user.job
  }).save()
}

function updateUser(user) {
  if (user.job) {
    const { job, ...rest } = user;
    return User.findOneAndUpdate({ _id: user.id }, { $push: { job: job }, ...rest }, { new: true });
  } else {
    return User.findOneAndUpdate({ _id: user.id }, { ...user }, { new: true });
  }
}

function deleteUser(id) {
  return User.findOneAndDelete({ _id: id }).exec();
}

module.exports = {
  getAllUsers: getAllUsers,
  addUser: addUser,
  findByUsername: findByUsername,
  findById: findById,
  addUserGraphql: addUserGraphql,
  updateUser: updateUser,
  deleteUser: deleteUser
}