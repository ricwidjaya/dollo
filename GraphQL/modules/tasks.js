const { gql } = require('apollo-server-express')
const { createModule } = require('graphql-modules')
const { Task } = require('../../models')

const taskModule = createModule({
  id: 'task-module',
  typeDefs: [
    gql`
      type Task {
        id: ID!
        userId: Int
        name: String
        done: Boolean
      }

      type Query {
        tasks: [Task]
      }

      type Mutation {
        addTask(userId: Int!, name: String): Task
        finishTask(id: ID!, userId: Int!): Task
      }
    `
  ],

  resolvers: {
    Query: {
      tasks: async () => await Task.findAll()
    },

    Mutation: {
      addTask: async (root, args, context) => {
        const { userId, name } = args
        const task = await Task.create({
          userId,
          name
        })
        return task
      }
    }
  }
})

module.exports = taskModule
