const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const User = require('./User')
class UserGroups extends Sequelize.Model {}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/database.sqlite'
})

UserGroups.init(
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
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

UserGroups.hasMany(User, { as: 'GroupMembers' })

// create all the defined tables in the specified database.
UserGroups.sync()
  .then(() => console.log("users table has been successfully created, if one doesn't exist"))
  .catch(error => console.log('This error occured', error))

// export User model for use in other files.
module.exports = User
