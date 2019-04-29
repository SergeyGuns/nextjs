const Sequelize = require('sequelize')

class Presentation extends Sequelize.Model {}
module.exports = sequelize =>
  Presentation.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
        // unique: true,
        // allowNull: false
      },
      filePath: {
        type: Sequelize.STRING,
        unique: true
      }
    },
    {
      sequelize
    }
  )
