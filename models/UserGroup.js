const Sequelize = require('sequelize')

class UserGroup extends Sequelize.Model {}
module.exports = sequelize =>
  UserGroup.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      }
    },
    {
      sequelize
    }
  )
