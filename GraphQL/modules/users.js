const { gql } = require('apollo-server-express')
const { createModule } = require('graphql-modules')
const jwt = require('jsonwebtoken')
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

      type Token {
        token: String
      }

      type Query {
        users: [User]
        user(id: ID!): User
        signIn(email: String!, password: String!): Token
      }

      type Mutation {
        signUp(
          username: String!
          email: String!
          password: String!
          confirmPassword: String!
        ): User
      }
    `
  ],

  resolvers: {
    Query: {
      users: async (root, args, context) => {
        return await User.findAll()
      },
      user: async id => await User.findByPk(id),
      
      signIn: async (root, args, context) => {
        console.log('signIn')
        console.log(args)
      }
    },

    Mutation: {
      signUp: async (root, args, context) => {
        console.log('signUp')
        console.log(args)
      }
    }
  }
})

module.exports = userModule
