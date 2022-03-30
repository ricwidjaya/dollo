const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { ApolloServer } = require('apollo-server-express')
const application = require('./GraphQL/application')
const PORT = process.env.PORT
const handlebars = require('express-handlebars')
const { api, pages } = require('./routes')

// Set view engine
app.engine('hbs', handlebars.engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.use('/api', api)
app.use('/', pages)

// GraphQL Apollo server
let apolloServer
// Load schema
const schema = application.createSchemaForApollo()
async function startServer() {
  apolloServer = new ApolloServer({
    schema
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
}
startServer()

app.listen(PORT, () => {
  console.log(`Dollo is running on port ${PORT} with love.`)
  console.log(`GraphQL API is running at ${PORT}${apolloServer.graphqlPath}`)
})
