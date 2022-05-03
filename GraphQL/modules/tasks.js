const { gql, UserInputError } = require('apollo-server-express')
const { createModule } = require('graphql-modules')
const { Task } = require('../../models')
const validator = require('validator')

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
        addTask(name: String!): Task
        finishTask(id: ID!): Task
        deleteTask(id: ID!): Task
      }
    `
  ],

  resolvers: {
    Query: {
      tasks: async (root, args, context) => {
        const userId = context.user.id
        if (args.done) {
          const tasks = await Task.findAll({
            where: { userId, done: true },
            raw: true
          })
          return tasks
        } else {
          const tasks = await Task.findAll({
            where: { userId, done: false },
            raw: true
          })
          return tasks
        }
      }
    },

    Mutation: {
      addTask: async (root, args, context) => {
        const { name } = args
        const userId = context.user.id

        // Check if length is over 20 words
        if (!validator.isByteLength(name, { min: 1, max: 20 })) {
          throw new UserInputError(
            'To-do must be within at least 1 to 20 words.'
          )
        }
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
