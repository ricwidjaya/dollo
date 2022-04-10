'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  async up(queryInterface, Sequelize) {
    const defaultPassword = '12345678'
    const seedUsers = [
      {
        username: 'root',
        first_name: 'Root',
        last_name: 'Dollo',
        email: 'root@example.com',
        password: bcrypt.hashSync(defaultPassword, bcrypt.genSaltSync(10)),
        avatar:
          'https://ui-avatars.com/api/?name=Root+Dollo&background=random&size=256&rounded=true&format=png',
        title: 'CEO',
        team_id: 1
      },
      {
        username: 'user1',
        first_name: 'User',
        last_name: 'One',
        email: 'user1@example.com',
        password: bcrypt.hashSync(defaultPassword, bcrypt.genSaltSync(10)),
        avatar:
          'https://ui-avatars.com/api/?name=User+One&background=random&size=256&rounded=true&format=png',
        title: 'COO',
        team_id: 1
      },
      {
        username: 'ricwid',
        first_name: 'Richard',
        last_name: 'Widjaya',
        email: 'ricwidjaya@gmail.com',
        password: bcrypt.hashSync(defaultPassword, bcrypt.genSaltSync(10)),
        avatar:
          'https://ui-avatars.com/api/?name=Richard+Widjaya&background=random&size=256&rounded=true&format=png',
        title: 'Software Engineer',
        team_id: 1
      }
    ]
    await queryInterface.bulkInsert('Users', seedUsers, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
