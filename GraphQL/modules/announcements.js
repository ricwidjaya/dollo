const { gql } = require('apollo-server-express')
const { createModule } = require('graphql-modules')
const { Announcement } = require('../../models')
const { Op } = require('sequelize')

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
        announcement(id: ID!): Announcement

        announcements(role: String, archived: Boolean): [Announcement]
      }

      type Mutation {
        addAnnouncement(title: String!, content: String!): Announcement

        adminAnnounce(
          title: String!
          content: String!
          expDate: String!
          pin: Boolean!
        ): Announcement

        approveAnnouncement(id: ID!): Announcement

        editAnnouncement(
          id: ID!
          title: String!
          content: String!
          expDate: String!
          pin: Boolean!
        ): Announcement

        deleteAnnouncement(id: ID!): Announcement

        togglePin(id: ID!): Announcement
      }
    `
  ],

  resolvers: {
    Query: {
      announcement: async (root, args, context) => {
        const { id } = args
        const announcement = await Announcement.findOne({
          where: { id }
        })

        return announcement
      },

      announcements: async (root, args, context) => {
        const { role, archived } = args

        if (archived) {
          const announces = await Announcement.findAll({
            where: {
              teamId: context.user.teamId,
              expDate: {
                [Op.lt]: new Date()
              }
            },
            order: [['id', 'DESC']],
            raw: true
          })
          return announces
        }

        if (role === 'member') {
          const announces = await Announcement.findAll({
            where: {
              teamId: context.user.teamId,
              approved: true,
              expDate: {
                [Op.gte]: new Date()
              }
            },
            order: [
              ['pin', 'DESC'],
              ['id', 'DESC']
            ],
            raw: true
          })
          return announces
        }

        if (role === 'manager') {
          const announces = await Announcement.findAll({
            where: {
              teamId: context.user.teamId,
              expDate: {
                [Op.gte]: new Date()
              }
            },
            order: [
              ['approved', 'ASC'],
              ['pin', 'DESC'],
              ['id', 'DESC']
            ],
            raw: true
          })
          return announces
        }
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
      },

      approveAnnouncement: async (root, args, context) => {
        const { id } = args
        const announcement = await Announcement.findByPk(id)

        const approvedAnnouncement = await announcement.update({
          approved: true
        })

        return approvedAnnouncement
      },

      editAnnouncement: async (root, args, context) => {
        const { id, title, content, expDate, pin } = args

        const announcement = await Announcement.findByPk(id)

        const updatedAnnouncement = await announcement.update({
          title,
          content,
          expDate,
          pin,
          approved: true
        })

        return updatedAnnouncement
      },

      deleteAnnouncement: async (root, args, context) => {
        const { id } = args
        const announcement = await Announcement.findByPk(id)

        const result = await announcement.destroy()

        return result
      },

      togglePin: async (root, args, context) => {
        const { id } = args
        const announcement = await Announcement.findByPk(id)

        const result = await announcement.update({
          pin: !announcement.pin
        })

        return result
      }
    }
  }
})

module.exports = announcementModule
