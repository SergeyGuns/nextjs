const Sequelize = require('sequelize')

class PresentationUserGroupLink extends Sequelize.Model {}
module.exports = sequelize =>
  PresentationUserGroupLink.init(
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
