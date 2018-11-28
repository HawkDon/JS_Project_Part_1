var express = require('express');
var router = express.Router();
var userFacade = require('../facades/userFacade');
var blogFacade = require('../facades/blogFacade');
var posFacade = require('../facades/posFacade');
var gju = require('geojson-utils');
var circleToPolygon = require('circle-to-polygon');

// Helper functions
var helpers = require('../helper_functions/convertFriends');

/* Get connection */
require('../dbSetup')(require("../settings").TEST_DB_URI);;

//Get Route callbacks
var client_routes = require('./client_routes');

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

/* GET all users. */
router.get('/users', async function (req, res, next) {
  var result = await userFacade.getAllUsers();
  res.json(result);
});

/* GET specific user by username with params */
router.get('/users/search/:userName', async function (req, res, next) {
  var result = await userFacade.findByUsername(req.params.userName);
  res.json(result);
});

/* GET specific user by id or username with query else throw an error*/
router.get('/users/search', async function (req, res, next) {
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
});

/* LOCATIONBLOGS */

/* GET all LocationBlogs. */
router.get('/locationblogs', async function (req, res, next) {
  var result = await blogFacade.getAllLocationBlogs();
  res.json(result);
});

/* GET specific user by username with params */
router.get('/locationblogs/search/:locationinfo', async function (req, res, next) {
  var result = await blogFacade.findLocationBlog(req.params.locationinfo)
  res.json(result);
});

router.post('/addblog', async function (req, res, next) {
  var body = req.body;
  var user = await userFacade.findById('5bc23b8d4fe27e113c5f6efa')
  var result = await blogFacade.addLocationBlog(body.info, body.longtitude, body.latitude, user)
  res.send("it's magic")
})

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