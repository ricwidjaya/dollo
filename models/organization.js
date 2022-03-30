'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Organization.hasMany(models.Team, { foreignKey: 'organizationId' })
    }
  }
  Organization.init(
    {
      name: DataTypes.STRING,
      headCounts: DataTypes.INTEGER,
      logo: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Organization',
      tableName: 'Organizations',
      underscored: true
    }
  )
  return Organization
}
