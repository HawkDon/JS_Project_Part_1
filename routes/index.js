var express = require('express');
var router = express.Router();
var userFacade = require('../facades/userFacade');
var blogFacade = require('../facades/blogFacade');
var posFacade = require('../facades/posFacade');
//var posFacade = require('../facades/posFacade');

/* Get connection */
require('../dbSetup')(require("../settings").TEST_DB_URI);;

//index

router.post('/', async function (req, res, next) {
  var body = req.body;
  var result = await userFacade.addUser(body.firstname, body.lastname, body.username, body.password, body.email)
  res.send("Succes!")
})

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Hey',
    message: 'Hello there!'
  })
})

/* USER */

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

/* GET specific user by id or username with query */
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

//Add pos

router.post('/addblog', async function (req, res, next) {
  var body = req.body;
  var user = await userFacade.findById('5bc23b8d4fe27e113c5f6efa')
  var result = await blogFacade.addLocationBlog(body.info, body.longtitude, body.latitude, user)
  res.send("it's magic")
})

router.get('/api/getlocation', async function (req, res, next) {
  const response = req.body // longtitude and latitude.
  //Get all positions within 1 - 5 km
  //Hardcoded
  const min = 0;
  const max = 5 * 10000000;
  const longitude = 70.324;
  const latitude = 40.765;
  const getPositions = await posFacade.findPositionplaces(min, max, longitude, latitude);

  // Map over and reformat
  const newArray = getPositions.map(obj => {
    return {
      username: obj.user.userName,
      longitude: obj.loc.coordinates[0],
      latitude: obj.loc.coordinates[1]
    }
  })

  const jsonObject = {
    friends: newArray
  };

  res.json(jsonObject);

})

router.post('/api/addPosition', async function (req, res, next) {
  var body = req.body;
  var pos = await posFacade.addPosition();
  res.json(pos)
})

router.post('/api/login', async function (req, res, next) {
  const user = req.body;

  //Get user validation
  const userInDB = await userFacade.findByUsername(user.username, next);

  //Convert array to object from db
  const userObject = userInDB.reduce((prev, curr) => curr, {});

  //Add location to user
  var blogPos = await blogFacade.findAndUpdateUserPos(userObject, user.longitude, user.latitude)

  /*
  We return login validation and position of user
  res.json(blogPos)
  */
})

router.get('/addblog', function (req, res) {
  res.render('blog', {
    title: 'blog',
    message: 'add blog'
  })
})
module.exports = router;