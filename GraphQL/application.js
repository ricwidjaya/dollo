const { createApplication } = require('graphql-modules')

// Load GraphQL modules
const userModule = require('./modules/users')
const taskModule = require('./modules/tasks')

// Create application
const application = createApplication({
  modules: [userModule, taskModule]
})

module.exports = application
