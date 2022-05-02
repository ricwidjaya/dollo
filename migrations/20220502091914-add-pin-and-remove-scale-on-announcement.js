'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Announcements', 'scale')
    await queryInterface.addColumn('Announcements', 'pin', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Announcements', 'pin')
    await queryInterface.removeColumn('Announcements', 'scale', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    })
  }
}
