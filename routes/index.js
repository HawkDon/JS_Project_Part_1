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
var routes = require('./routes');

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
router.post('/api/register', routes.registerEndPoint)

// Login and update pos
router.post('/api/login', async function (req, res, next) {
  const user = req.body.user;
  const coords = req.body;
  //Get user validation
  const userInDB = await userFacade.findByUsername(user.username, next);
  if (!userInDB.length || userInDB[0].password !== user.password) {
    res.send(JSON.stringify({ status: "invalid username or password, please try again", error: true }))
  } else {

    //Convert array to object from db
    const userObject = userInDB.reduce((prev, curr) => curr, {});

    //Add position to user
    const pos = await posFacade.findAndUpdatePositionOnUser(userInDB, coords.longitude, coords.latitude).catch(res => console.log(res.message));

    res.send(JSON.stringify({ status: "Welcome: " + user.username, error: false, payload: { username: user.username, longitude: coords.longitude, latitude: coords.latitude } }))
  }
  next();
})

/* POSITIONS */

//UserPositionUpdates
router.post('/api/updatePos', async function (req, res, next) {
  const body = req.body;

  const pos = await posFacade.findAndUpdatePositionOnUsername(body.username, body.longitude, body.latitude).catch(res => console.log(res.message));

  res.send(JSON.stringify({ status: "Welcome: " + body.username, error: false, payload: { username: body.username, longitude: body.longitude, latitude: body.latitude } }))
})

//Get nearbyfriends and positions
router.post('/api/nearbyplayers', async function (req, res, next) {
  const username = req.body.username;
  const userLoggedIn = await userFacade.findByUsername(username);
  const position = await posFacade.findPositionForUser(userLoggedIn[0]._id)
  const getPositions = await posFacade.getAllFriends();
  const radiusIn = req.body.radius;

  const coordinates = [position.loc.coordinates[0], position.loc.coordinates[1]]; //[lon, lat]
  const radius = radiusIn * 1000;                           // in meters to km
  const numberOfEdges = 32;                           //optional that defaults to 32
 
  //Make circle around user
  let polygon = circleToPolygon(coordinates, radius, numberOfEdges);

  // Validate if Points is in polygon
  const friendsInPolygon = [];
  getPositions.forEach(element => {
    if(gju.pointInPolygon({ "type":"Point","coordinates":[element.loc.coordinates[0], element.loc.coordinates[1]] },polygon)){
      friendsInPolygon.push(element)
    }
  });

  const removeUserFromList = await helpers.removeUserFromFriendList(friendsInPolygon, username);
  res.send(JSON.stringify(removeUserFromList));
})

//Get all friends upon login
router.post('/api/allFriends', async function (req, res, next) {
  const body = req.body;
  const username = body.username;
  //First get positions.
  const getPositions = await posFacade.getAllFriends();

  const friends = await helpers.removeUserFromFriendList(getPositions, username)

  res.send(JSON.stringify(friends));
  next();
})

module.exports = router;