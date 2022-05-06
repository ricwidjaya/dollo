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
          'https://ui-avatars.com/api/?name=root&background=random&size=36&rounded=true&format=png&length=1',
        title: 'CEO',
        team_id: 1,
        role: 0
      },
      {
        username: 'user1',
        first_name: 'User',
        last_name: 'One',
        email: 'user1@example.com',
        password: bcrypt.hashSync(defaultPassword, bcrypt.genSaltSync(10)),
        avatar:
          'https://ui-avatars.com/api/?name=user1&background=random&size=36&rounded=true&format=png&length=1',
        title: 'COO',
        team_id: 1,
        role: 1
      },
      {
        username: 'ricwid',
        first_name: 'Richard',
        last_name: 'Widjaya',
        email: 'ricwidjaya@gmail.com',
        password: bcrypt.hashSync(defaultPassword, bcrypt.genSaltSync(10)),
        avatar:
          'https://ui-avatars.com/api/?name=ricwid&background=random&size=36&rounded=true&format=png&length=1',
        title: 'Software Engineer',
        team_id: 1,
        role: 1
      }
    ]
    await queryInterface.bulkInsert('Users', seedUsers, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
