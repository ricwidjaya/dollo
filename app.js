const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { ApolloServer } = require('apollo-server-express')
const application = require('./GraphQL/application')
const PORT = process.env.PORT
const handlebars = require('express-handlebars')
const handlebarsHelper = require('./helpers/handlebar-helper')
const { api, pages } = require('./routes')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
const jwt = require('jsonwebtoken')
const { authenticated } = require('./helpers/auth')

// Set view engine
app.engine(
  'hbs',
  handlebars.engine({ extname: '.hbs', helpers: handlebarsHelper })
)
app.set('view engine', 'hbs')

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(express.static('public'))

app.use('/api', api)
app.use('/', pages)

// GraphQL Apollo server
let apolloServer
// Load schema
const schema = application.createSchemaForApollo()
async function startServer() {
  apolloServer = new ApolloServer({
    schema,
    formatError: error => {
      console.log(error)
      return error
    },
    context: ({ req, res }) => {
      // Exclude pages don't need auth
      const query = req.body.query
      if (query.includes('signIn') || query.includes('signUp')) {
        return { req, res }
      }

      // Authenticate user and put it in context
      authenticated(req, res)
      const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
      return { user }
    }
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
}
startServer()

app.listen(PORT, () => {
  console.log(`Dollo is running on port ${PORT} with love.`)
  console.log(`GraphQL API is running at ${PORT}${apolloServer.graphqlPath}`)
})
