const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
class User extends Sequelize.Model {}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/database.sqlite'
})

User.init(
  {
    username: {
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
    }
  },
  {
    sequelize,
    hooks: {
      beforeCreate: user => {
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(user.password, salt)
      }
    }
  }
)
User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}
// create all the defined tables in the specified database.
User.sync()
  .then(() => console.log("users table has been successfully created, if one doesn't exist"))
  .catch(error => console.log('This error occured', error))

// export User model for use in other files.
module.exports = User
