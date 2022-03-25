'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const seedUsers = [
      {
        username: 'ricwid',
        first_name: 'Richard',
        last_name: 'Widjaya',
        email: 'ricwid@gmail.com',
        password: '12345678',
        avatar:
          'https://ui-avatars.com/api/?name=Richard+Widjaya&background=random&size=256&rounded=true&format=png',
        title: '火影',
        team_id: 1
      },
      {
        username: 'root',
        first_name: 'root',
        last_name: 'Yeh',
        email: 'root@example.com',
        password: '12345678',
        avatar:
          'https://ui-avatars.com/api/?name=Richard+Widjaya&background=random&size=256&rounded=true&format=png',
        title: '風影',
        team_id: 2
      }
    ]
    await queryInterface.bulkInsert('Users', seedUsers, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {})
  }
}
