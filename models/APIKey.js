const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync()

class APIKey extends Sequelize.Model {}
APIKey.prototype.validKey = function(key) {
  return bcrypt.compareSync(key, this.key)
}

module.exports = sequelize =>
  APIKey.init(
    {
      key: {
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      isAdmin: {
        type: Sequelize.BOOLEAN
      }
    },
    {
      sequelize,
      hooks: {
        beforeCreate: apiKey => {
          apiKey.key = bcrypt.hashSync(apiKey.email, salt)
        }
      }
    }
  )
