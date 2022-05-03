const { gql } = require('apollo-server-express')
const { createModule } = require('graphql-modules')
const { Announcement } = require('../../models')

const announcementModule = createModule({
  id: 'announcement-module',
  typeDefs: [
    gql`
      type Announcement {
        id: ID!
        title: String
        content: String
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
        const announces = await Announcement.findAll({
          where: { teamId: context.user.teamId },
          order: [
            ['pin', 'DESC'],
            ['id', 'DESC']
          ],
          raw: true
        })
        return announces
      },

      allAnnouncements: async (root, args, context) => {
        console.log('all an')
        return 'b'
      }
    }
  }
})

module.exports = announcementModule
