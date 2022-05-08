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

      type Mutation {
        addAnnouncement(title: String!, content: String!): Announcement
        adminAnnounce(
          title: String!
          content: String!
          expDate: String!
          pin: Boolean!
        ): Announcement
      }
    `
  ],

  resolvers: {
    Query: {
      announcements: async (root, args, context) => {
        const announces = await Announcement.findAll({
          where: { teamId: context.user.teamId, approved: true },
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
    },

    Mutation: {
      addAnnouncement: async (root, args, context) => {
        const { title, content } = args
        if (!title || !content)
          throw new UserInputError('Please fill out the form.')

        // Set default expired date as one day from now
        const date = new Date()
        const expDate = date.setDate(date.getDate() + 1)

        const announce = await Announcement.create({
          title,
          content,
          expDate,
          teamId: context.user.teamId
        })

        return announce
      },

      adminAnnounce: async (root, args, context) => {
        const { title, content, expDate, pin } = args
        const announcement = await Announcement.create({
          title,
          content,
          expDate,
          pin,
          teamId: context.user.teamId,
          approved: true
        })

        return announcement
      }
    }
  }
})

module.exports = announcementModule
