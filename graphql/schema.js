var resolvers = require("./resolvers");
var makeExecutableSchema = require("graphql-tools").makeExecutableSchema;

const scalarTypes = `
    scalar Date
`;

const userDefs = `
    type Job {
        type: String
        company: String
        companyUrl: String
    }

    type User {
        id: ID
        userName: String
        firstName: String
        lastName: String
        password: String
        email: String
        job: [Job]
        created: Date,
        lastUpdated: Date
    }
`;

const locationBlogDefs = `
    type BlogPosition {
        longitude: Float
        latitude: Float
    }

    type LocationBlog {
        id: ID
        info: String
        pos: BlogPosition
        created: Date
        author: ID
        likedBy: [ID]
    }
`;

const positionDefs = `
    type LogInfo {
        type: String
        coordinates: [Float]
    }
    type Position {
        user: ID
        loc: LogInfo
        created: Date
    }
`;

const typeQueries = `
    type Query {
        getAllLocationBlogs: [LocationBlog]
        getOneLocationBlog(info: String!): LocationBlog
        getAllUsers: [User]
        getOneUser(id: ID!): User
        getAllPositions: [Position]
        getOnePosition(id: ID!): Position
    }
`;

const typeMutations = `
    type Mutation {
        createUser(input: UserInput): User
        createLocationBlog(input: LocationInput): LocationBlog
        updateUser(input: UserUpdateInput): User
        deleteUser(id: ID!): String
    }

    input LocationInput {
        info: String
        pos: CoordInput
        author: ID
    }

    input CoordInput {
        longitude: Float
        latitude: Float
    }

    input UserInput {
        userName: String!
        firstName: String
        lastName: String
        password: String
        email: String
        job: [JobInput]
    }

    input UserUpdateInput {
        id: ID!
        userName: String
        firstName: String
        lastName: String
        password: String
        email: String
        job: JobInput
    }

    input JobInput {
        type: String
        company: String
        companyUrl: String
    }
`;

const schema = makeExecutableSchema({ typeDefs: [scalarTypes, userDefs, locationBlogDefs, positionDefs, typeQueries, typeMutations], resolvers })

module.exports = schema;