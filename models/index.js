const sequelize = require('./sequelize-config')
const User = require('./User')(sequelize)
const UserGroup = require('./UserGroup')(sequelize)
const UserGroupLink = require('./UserGroupLink')(sequelize)
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync()

// Assiciations

// User.belongsToMany(UserGroup, {
//   as: 'Groups',
//   through: 'UserGroupLinks',
//   foreignKey: User.id
// })
// UserGroup.hasMany(User)
// User.belongsToMany(UserGroup, {
//   through: 'UserGroups'
// })
// create all the defined tables in the specified database.

// User.hasMany(UserGroup) // Will add userId to Task model
// Will also add userId to Task model

UserGroup.belongsToMany(User, { through: 'UserGroupLink' })
User.belongsToMany(UserGroup, { through: 'UserGroupLink' })

sequelize
  .sync({ force: true })
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
    User.findOrCreate({
      where: {
        name: 'serg',
        email: 'serg',
        password: bcrypt.hashSync('serg', salt),
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
      UserGroup.findAll().then(groups => {
        Promise.all(groups.map(group => user.addUserGroup(group)))
      })
    })
  )
  .then(() =>
    User.findOne({
      where: {
        name: 'serg'
      }
    }).then(user => {
      UserGroup.findAll().then(groups => {
        Promise.all(groups.map(group => user.addUserGroup(group)))
      })
    })
  )
  .catch(error => console.log('This error occured', error))

module.exports = {
  User,
  UserGroup,
  UserGroupLink
}
