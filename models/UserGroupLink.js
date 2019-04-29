const Sequelize = require('sequelize')

class UserGroupLink extends Sequelize.Model {}
module.exports = sequelize =>
  UserGroupLink.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    },
    {
      sequelize
    }
  )
