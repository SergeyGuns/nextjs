const { resolver } = require('graphql-sequelize')
const graphqlHTTP = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLString
} = require('graphql')

// name: {
//   type: Sequelize.STRING,
//   unique: true,
//   allowNull: false
// },
// email: {
//   type: Sequelize.STRING,
//   unique: true,
//   allowNull: false
// },
// password: {
//   type: Sequelize.STRING,
//   allowNull: false
// },
// isAdmin: {
//   type: Sequelize.BOOLEAN
// }

let userType = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the user.'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the user.'
    },
    email: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    }
  }
})

module.exports = (server, User) => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootType',
      fields: {
        user: {
          type: userType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLInt)
            }
          },
          resolve: resolver(User)
        }
      }
    })
  })
  server.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: process.env.NODE_ENV === 'development'
    })
  )
}
