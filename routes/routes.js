var userFacade = require('../facades/userFacade');

async function registerEndPoint(req, res, next) {
    var body = req.body;
    var result = await userFacade.addUser(body.firstname, body.lastname, body.username, body.password, body.email)
    if (!result) {
      res.send(JSON.stringify({ status: "User has not been registered, because the username already exists.", error: true }))
    } else {
      res.send(JSON.stringify({ status: "User has been succesfully registered", error: false }))
    }
}

module.exports = {
  registerEndPoint: registerEndPoint
}