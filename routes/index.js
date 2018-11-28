var express = require('express');
var router = express.Router();

/* Get connection */
require('../dbSetup')(require("../settings").TEST_DB_URI);;

//Get Route callbacks
var client_routes = require('./client_routes');
var server_routes = require('./server_routes');

//Server-side rendering

//FrontPage
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Hey',
    message: 'Hello there!'
  })
})

//Add Blog
router.get('/addblog', function (req, res) {
  res.render('blog', {
    title: 'blog',
    message: 'add blog'
  })
})

// Server endpoints

// Add new user
router.post('/', server_routes.addUser)

// Add new blog
router.post('/addblog', server_routes.addBlog)

/* GET all users. */
router.get('/users', server_routes.getAllUsers);

/* GET specific user by username with params */
router.get('/users/search/:userName', server_routes.getUserByUsername);

/* GET specific user by id or username with query else throw an error*/
router.get('/users/search', server_routes.getUserByUsernameOrId);

/* LOCATIONBLOGS */

/* GET all LocationBlogs. */
router.get('/locationblogs', server_routes.getAllLocationBlogs);

/* GET Location by info */
router.get('/locationblogs/search/:locationinfo', server_routes.getLocationByInfo);


// Native endpoints

// Register
router.post('/api/register', client_routes.registerEndPoint)

// Login and update pos
router.post('/api/login', client_routes.loginAndUpdateUserPos)

/* POSITIONS */

//UserPositionUpdates
router.post('/api/updatePos', client_routes.updateUserPos)

//Get nearbyfriends and positions
router.post('/api/nearbyplayers', client_routes.getNearbyFriends)

//Get all friends upon login
router.post('/api/allFriends', client_routes.getAllFriends)

module.exports = router;