const sequelize = require('./sequelize-config')
const User = require('./User')(sequelize)
const UserGroup = require('./UserGroup')(sequelize)
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync()

// Assiciations

User.belongsToMany(UserGroup, {
  as: 'Groups',
  through: 'UserGroupLinks',
  foreignKey: User.id
})
// User.belongsToMany(UserGroup, {
//   through: 'UserGroups'
// })
// create all the defined tables in the specified database.
sequelize
  .sync({ farce: true })
  .then(() => console.log("users table has been successfully created, if one doesn't exist"))
  .then(() => UserGroup.findOrCreate({ where: { name: 'Green Team' } }))
  .then(() => UserGroup.findOrCreate({ where: { name: 'Blue Team' } }))
  .then(() =>
    User.findOrCreate({
      where: {
        name: 'admin',
        email: 'admin',
        password: bcrypt.hashSync('admin', salt),
        isAdmin: true
      }
    })
  )
  .then(() =>
    User.findOne({
      where: {
        name: 'admin'
      }
    }).then(user => {
      console.dir(user)
      UserGroup.findOne({ where: { name: 'Green Team' } }).then(group => {
        user.addGroups(group.dataValues.id)
      })
    })
  )
  .catch(error => console.log('This error occured', error))

module.exports = {
  User,
  UserGroup
}
