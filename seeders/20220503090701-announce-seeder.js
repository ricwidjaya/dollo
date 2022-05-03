'use strict'

const { sequelize } = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    let teamId = await queryInterface.sequelize.query(
      `
      SELECT id FROM Teams
      WHERE name = "Dollo"
    `,
      {
        type: sequelize.QueryTypes.SELECT
      }
    )

    teamId = teamId[0]['id']

    // Seed announces content
    const announces = [
      {
        title: 'Grand Release',
        content: 'WoW, Dollo is ready to run!',
        exp_date: new Date(2099, 1, 1),
        approved: true,
        team_id: teamId,
        pin: true
      },
      {
        title: 'HBD',
        content: 'HBD to Richard.',
        exp_date: new Date(2099, 1, 1),
        approved: true,
        team_id: teamId
      },
      {
        title: 'Office Memo',
        content: 'Remember close fridge after using!',
        exp_date: new Date(2099, 1, 1),
        approved: true,
        team_id: teamId
      }
    ]

    await queryInterface.bulkInsert('Announcements', announces, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Announcements', null, {})
  }
}
