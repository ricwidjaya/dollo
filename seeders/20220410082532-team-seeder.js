'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const headCounts = await queryInterface.sequelize.query(
      `
      SELECT 
        COUNT(id) as 'count'
      FROM Users
      WHERE team_id = 1
    `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const team = [
      {
        name: 'Dollo',
        head_counts: headCounts[0]['count']
      }
    ]

    await queryInterface.bulkInsert('Teams', team, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teams', null, {})
  }
}
