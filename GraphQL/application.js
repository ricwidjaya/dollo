const { createApplication } = require('graphql-modules')

// Load GraphQL modules
const userModule = require('./modules/users')

// Create application
const application = createApplication({
  modules: [userModule]
})

module.exports = application
