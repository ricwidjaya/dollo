'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.User, { foreignKey: 'hostId' })

      // Join Tables
      Event.belongsToMany(models.User, {
        through: models.Participant,
        foreignKey: 'event_id',
        as: 'Attendee'
      })
    }
  }
  Event.init(
    {
      name: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      startAt: DataTypes.DATE,
      endAt: DataTypes.DATE,
      hostId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Event',
      tableName: 'Events',
      underscored: true
    }
  )
  return Event
}
