const { gql } = require('apollo-server-express')
const { createModule } = require('graphql-modules')
const { User } = require('../../models')

const userModule = createModule({
  id: 'user-module',
  typeDefs: [
    gql`
      type User {
        id: ID!
        username: String
        firstName: String
        lastName: String
        email: String
        password: String
        avatar: String
        title: String
        TeamId: Int
      }

      type Query {
        users: [User]
        user(id: ID!): User
      }
    `
  ],

  resolvers: {
    Query: {
      users: async (root, args, context) => {
        console.log(context.user)
        return await User.findAll()
      },
      user: async id => await User.findByPk(id)
    }
  }
})

module.exports = userModule
