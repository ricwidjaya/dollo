const {
  gql,
  ApolloError,
  UserInputError,
  AuthenticationError
} = require('apollo-server-express')
const { createModule } = require('graphql-modules')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
        // Check user info
        const { email, password } = args

        if (!email || !password)
          throw new AuthenticationError('Missing email or password.')

        const user = await User.findOne({ where: { email } })

        if (!user || !bcrypt.compareSync(password, user.password))
          throw new AuthenticationError('Incorrect email or password.')

        // Issue jwt token
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: '3d'
        })

        return { token }
      }
    },

    Mutation: {
      signUp: async (root, args, context) => {
        const { username, email, password, confirmPassword } = args
        const user = await User.findOne({ where: { email } })
        if (user) throw new ApolloError('User already exist.')
        if (password !== confirmPassword)
          throw new UserInputError('Please check your password.')

        const newUser = await User.create({
          username,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        })

        return newUser
      }
    }
  }
})

module.exports = userModule
