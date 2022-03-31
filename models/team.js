'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Team.belongsTo(models.Organization, { foreignKey: 'organizationId' })
      Team.hasMany(models.Announcement, { foreignKey: 'teamId' })
      Team.hasMany(models.Permission, { foreignKey: 'teamId' })
    }
  }
  Team.init(
    {
      name: DataTypes.STRING,
      headCounts: DataTypes.INTEGER,
      organizationId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Team',
      tableName: 'Teams',
      underscored: true
    }
  )
  return Team
}
