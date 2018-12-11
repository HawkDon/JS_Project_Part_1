var GraphQLScalarType = require('graphql').GraphQLScalarType;
var Kind = require('graphql/language').Kind;

// Mongoose conversion of Object ID:
const ObjectId = require('mongoose').Types.ObjectId;

var posFacade = require('../facades/posFacade');
var userFacade = require('../facades/userFacade');
var blogFacade = require('../facades/blogFacade');

// ES6 Entities
var User = require('./entities').User;

const convertObjectId = () => {
  ObjectId.prototype.valueOf = function () {
    return this.toString();
  };
}

const changePropIdToUser = (element) => {
  element['user'] = element._id;
  delete element._id;
  return element;
}

const resolvers = {
  Query: {
    getAllLocationBlogs: () => {
      const locationBlogs = blogFacade.getAllLocationBlogs();

      //Ids doesn't get tranformed correctly so we have to do vaiue of and convert them correctly
      convertObjectId();

      return locationBlogs;
    },
    getOneLocationBlog: (root, { info }) => {
      const locationBlog = blogFacade.findLocationBlog(info);

      //Ids doesn't get tranformed correctly so we have to do vaiue of and convert them correctly
      convertObjectId();

      return locationBlog;
    },
    getAllUsers: () => {
      const users = userFacade.getAllUsers();
      return users;
    },
    getOneUser: (root, { id }) => {
      const user = userFacade.findById(id);
      return user;
    },
    getAllPositions: async () => {
      const payload = await posFacade.getAllFriends();

      //Ids doesn't get tranformed correctly so we have to do vaiue of and convert them correctly
      convertObjectId();

      // Right now our ID is defined in the '_id' property, so we have to rename it over to 'user' like in our schema.
      const Positions = payload.map(element => {
        return changePropIdToUser(element);
      });

      return Positions;
    },
    getOnePosition: async (root, { id }) => {
      const position = await posFacade.findPositionForUser(id);

      //Ids doesn't get tranformed correctly so we have to do vaiue of and convert them correctly
      convertObjectId();

      const finalPosition = changePropIdToUser(position);

      return finalPosition;
    }
  },
  Mutation: {
    createUser: (root, { input }) => {
      // Create user entity
      const user = new User(input.userName, input.firstName, input.lastName, input.password, input.email, input.job);
      const payload = userFacade.addUserGraphql(user);
      return payload;
    },
    createLocationBlog: (root, { input }) => {
      //Ids doesn't get tranformed correctly so we have to do vaiue of and convert them correctly
      convertObjectId();
      const locationBlog = blogFacade.addLocationBlog(input.info, input.pos.longitude, input.pos.latitude, input.author);
      return locationBlog
    },
    updateUser: (root, { input }) => {
      const user = userFacade.updateUser(input);
      return user;
    },
    deleteUser: (root, { id }) => {
      convertObjectId();
      userFacade.deleteUser(id);
      return "User has been succesfully deleted";
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.toString(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null;
    },
  })
}


module.exports = resolvers;