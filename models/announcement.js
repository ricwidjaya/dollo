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
      Announcement.belongsTo(models.Organization, {
        foreignKey: 'organizationId'
      })
      Announcement.belongsTo(models.Team, { foreignKey: 'teamId' })
    }
  }
  Announcement.init(
    {
      content: DataTypes.TEXT,
      scale: DataTypes.STRING,
      exp_date: DataTypes.DATE,
      approved: DataTypes.BOOLEAN,
      teamId: DataTypes.INTEGER,
      organizationId: DataTypes.INTEGER
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
