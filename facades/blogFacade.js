var LocationBlog = require('../models/LocationBlog');

function getAllLocationBlogs() {
    return LocationBlog.find({}).exec();
}

function addLocationBlog(info, longitude, latitude, user) {
    return new LocationBlog({info, pos: { longitude, latitude }, author: user}).save();
}

function findLocationBlog(info) {
    return LocationBlog.findOne({info: info}).exec();
}

async function likeLocationBlogUpdate(locationBlog, user) {
    await LocationBlog.update({ _id: locationBlog._id }, { $push: { likedBy: user }}).exec();
    return findLocationBlog(locationBlog.info);
}

module.exports = {
    addLocationBlog: addLocationBlog,
    likeLocationBlogUpdate: likeLocationBlogUpdate,
    findLocationBlog: findLocationBlog,
    getAllLocationBlogs: getAllLocationBlogs
}