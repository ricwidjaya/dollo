const { createApplication } = require('graphql-modules')

// Load GraphQL modules
const userModule = require('./modules/users')
const taskModule = require('./modules/tasks')
const announcementModule = require('./modules/announcements')

// Create application
const application = createApplication({
  modules: [userModule, taskModule, announcementModule]
})

module.exports = application
