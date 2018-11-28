var posFacade = require('../facades/posFacade');

module.exports.removeUserFromFriendList = async function removeUserFromFriendList(res, username) {
  const allFriends = [];
  for (let index = 0; index < res.length; index++) {
    const user = await posFacade.findUserForPosition(res[index]._id);
    if (user.userName !== username) {
      allFriends.push({ position: res[index].loc.coordinates, user: user.userName });
    }
  }
  return allFriends;
}
