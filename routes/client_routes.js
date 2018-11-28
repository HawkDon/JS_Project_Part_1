var userFacade = require('../facades/userFacade');
var posFacade = require('../facades/posFacade');

async function registerEndPoint(req, res, next) {
    var body = req.body;
    var result = await userFacade.addUser(body.firstname, body.lastname, body.username, body.password, body.email)
    if (!result) {
      res.send(JSON.stringify({ status: "User has not been registered, because the username already exists.", error: true }))
    } else {
      res.send(JSON.stringify({ status: "User has been succesfully registered", error: false }))
    }
}

async function loginAndUpdateUserPos(req, res, next) {
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
}

async function updateUserPos(req, res, next) {
  const body = req.body;

  const pos = await posFacade.findAndUpdatePositionOnUsername(body.username, body.longitude, body.latitude).catch(res => console.log(res.message));

  res.send(JSON.stringify({ status: "Welcome: " + body.username, error: false, payload: { username: body.username, longitude: body.longitude, latitude: body.latitude } }))
}

async function getNearbyFriends(req, res, next) {
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
}


async function getAllFriends(req, res, next) {
  const body = req.body;
  const username = body.username;
  //First get positions.
  const getPositions = await posFacade.getAllFriends();

  const friends = await helpers.removeUserFromFriendList(getPositions, username)

  res.send(JSON.stringify(friends));
  next();
}
module.exports = {
  registerEndPoint: registerEndPoint,
  loginAndUpdateUserPos: loginAndUpdateUserPos,
  updateUserPos: updateUserPos,
  getNearbyFriends: getNearbyFriends,
  getAllFriends: getAllFriends
}