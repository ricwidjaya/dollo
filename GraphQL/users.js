const { gql } = require('apollo-server-express')
const { User } = require('../models')

const typeDefs = gql`
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
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: async () => {
      return 'Hello'
    },
    users: async () => await User.findAll(),
    user: async id => await User.findByPk(id)
  }
}

module.exports = { typeDefs, resolvers }
