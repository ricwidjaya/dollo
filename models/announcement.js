'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Announcement.belongsTo(models.Team, { foreignKey: 'teamId' })
    }
  }
  Announcement.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      expDate: DataTypes.DATE,
      approved: DataTypes.BOOLEAN,
      teamId: DataTypes.INTEGER,
      pin: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Announcement',
      tableName: 'Announcements',
      underscored: true
    }
  )
  return Announcement
}
