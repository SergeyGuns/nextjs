const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync()

class User extends Sequelize.Model {}
User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = sequelize =>
  User.init(
    {
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isAdmin: {
        type: Sequelize.BOOLEAN
      }
    },
    {
      sequelize,
      hooks: {
        beforeCreate: user => {
          user.password = bcrypt.hashSync(user.password, salt)
        }
      }
    }
  )
