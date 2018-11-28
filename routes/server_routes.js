var userFacade = require('../facades/userFacade');
var blogFacade = require('../facades/blogFacade');

async function addBlog(req, res, next) {
    var body = req.body;
    var user = await userFacade.findById(body.userid)
    var result = await blogFacade.addLocationBlog(body.info, body.longtitude, body.latitude, user)
    res.send("Blog added to user")
}

async function getLocationByInfo(req, res, next) {
    var result = await blogFacade.findLocationBlog(req.params.locationinfo)
    res.json(result);
}

async function getAllUsers(req, res, next) {
    var result = await userFacade.getAllUsers();
    res.json(result);
}

async function getUserByUsername(req, res, next) {
    var result = await userFacade.findByUsername(req.params.userName);
    res.json(result);
}

async function getUserByUsernameOrId(req, res, next) {
    try {
        var result;
        if (req.query.uId) {
            result = await userFacade.findById(req.query.uId);
            res.json(result);
        } else if (req.query.uName) {
            result = await userFacade.findByUsername(req.query.uName);
            res.json(result);
        } else {
            throw new Error('Something went wrong with your queries. Please try again');
        }
    } catch (error) {
        next(error)
    }
}

async function getAllLocationBlogs(req, res, next) {
    var result = await blogFacade.getAllLocationBlogs();
    res.json(result);
}

async function addUser(req, res, next) {
    var body = req.body
    var result = await userFacade.addUser(body.firstname, body.lastname, body.username, body.password, body.email);
    res.send("Succes! you have been registered!")
}

module.exports = {
    addBlog: addBlog,
    getLocationByInfo: getLocationByInfo,
    getAllUsers: getAllUsers,
    getUserByUsername: getUserByUsername,
    getUserByUsernameOrId: getUserByUsernameOrId,
    getAllLocationBlogs: getAllLocationBlogs,
    addUser: addUser
}