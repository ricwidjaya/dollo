'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Task, { foreignKey: 'userId' })
      User.hasMany(models.Event, { foreignKey: 'hostId' })

      // Join Tables
      User.belongsToMany(models.Event, {
        through: models.Participant,
        foreignKey: 'userId',
        as: 'AttendEvents'
      })
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      title: DataTypes.STRING,
      teamId: DataTypes.INTEGER,
      role: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true
    }
  )
  return User
}
