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
        addTask(name: String): Task
        finishTask(id: ID!): Task
        deleteTask(id: ID!): Task
      }
    `
  ],

  resolvers: {
    Query: {
      tasks: async (root, args, context) => await Task.findAll()
    },

    Mutation: {
      addTask: async (root, args, context) => {
        const { name } = args
        const task = await Task.create({
          userId,
          name
        })
        return task
      },

      finishTask: async (root, args, context) => {
        const task = await Task.findByPk(args.id)
        console.log(task)
        return task
      }
    }
  }
})

module.exports = taskModule
