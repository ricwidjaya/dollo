'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Announcements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      exp_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Announcements');
  }
};