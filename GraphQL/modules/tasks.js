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
        tasks(done: Boolean): [Task]
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
      tasks: async (root, args, context) => {
        if (args.done) {
          const tasks = await Task.findAll({
            where: { done: true },
            raw: true
          })
          return tasks
        } else {
          const tasks = await Task.findAll({
            where: { done: false },
            raw: true
          })
          return tasks
        }
      }
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
        const { id } = args
        const task = await Task.findByPk(id)
        await task.update({
          done: true
        })
        return task
      },

      deleteTask: async (root, args, context) => {
        const { id } = args
        const task = await Task.findByPk(id)
        await task.destroy()
        return task
      }
    }
  }
})

module.exports = taskModule
