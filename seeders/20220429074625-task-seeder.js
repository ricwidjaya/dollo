'use strict'
const { faker } = require('@faker-js/faker')

const TASKS_COUNT = 3
const DONE_COUNT = 1

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `
      SELECT * FROM Users
    `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const userCounts = users.length
    const taskSeeds = []
    // Create new tasks for each user
    for (let i = 0; i < userCounts; i++) {
      for (let j = 0; j < TASKS_COUNT; j++) {
        const task = {
          user_id: users[i]['id'],
          name: faker.random.words(2),

          // if the index of task is bigger than the subtract of done_count, it should be expected as "done".
          done: j >= TASKS_COUNT - DONE_COUNT
        }
        taskSeeds.push(task)
      }
    }
    await queryInterface.bulkInsert('Tasks', taskSeeds, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tasks', null, {})
  }
}
