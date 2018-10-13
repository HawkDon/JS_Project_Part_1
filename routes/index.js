var express = require('express');
var router = express.Router();
var userFacade = require('../facades/userFacade');
var blogFacade = require('../facades/blogFacade');

/* Get connection */
require('../dbSetup')(require("../settings").TEST_DB_URI);;


/* USER */

/* GET all users. */
router.get('/users', async function(req, res, next) {
  var result = await userFacade.getAllUsers();
  res.json(result);
});

/* GET specific user by username with params */
router.get('/users/search/:userName', async function(req, res, next) {
  var result = await userFacade.findByUsername(req.params.userName);
  res.json(result);
});

/* GET specific user by id or username with query */
router.get('/users/search', async function(req, res, next) {
  try {
    var result;
    if(req.query.uId) {
      result = await userFacade.findById(req.query.uId);
      res.json(result);
    }
    else if(req.query.uName) {
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
router.get('/locationblogs', async function(req, res, next) {
  var result = await blogFacade.getAllLocationBlogs();
  res.json(result);
});

/* GET specific user by username with params */
router.get('/locationblogs/search/:locationinfo', async function(req, res, next) {
  var result = await blogFacade.findLocationBlog(req.params.locationinfo)
  res.json(result);
});

module.exports = router;
