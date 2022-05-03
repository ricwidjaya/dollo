const { gql } = require('apollo-server-express')
const { createModule } = require('graphql-modules')
const { Announcement } = require('../../models')

const announcementModule = createModule({
  id: 'announcement-module',
  typeDefs: [
    gql`
      type Announcement {
        id: ID!
        expDate: String
        approved: Boolean
        teamId: Int
        pin: Boolean
      }

      type Query {
        announcements: [Announcement]
        allAnnouncements: [Announcement]
      }
    `
  ],

  resolvers: {
    Query: {
      announcements: async (root, args, context) => {
        console.log('annouce valid')
        return 'a'
      },

      allAnnouncements: async (root, args, context) => {
        console.log('all an')
        return 'b'
      }
    }
  }
})

module.exports = announcementModule
