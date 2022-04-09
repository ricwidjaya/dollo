'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permission.belongsTo(models.User, { foreignKey: 'userId' })
      Permission.belongsTo(models.Team, { foreignKey: 'teamId' })
      Permission.belongsTo(models.Role, {
        foreignKey: 'roleId'
      })
    }
  }
  Permission.init(
    {
      userId: DataTypes.INTEGER,
      teamId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'Permissions',
      underscored: true
    }
  )
  return Permission
}
