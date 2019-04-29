const sequelize = require('./sequelize-config')
const User = require('./User')(sequelize)
const UserGroup = require('./UserGroup')(sequelize)
const UserGroupLink = require('./UserGroupLink')(sequelize)
const Presentation = require('./Presentation')(sequelize)
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync()

//Links
UserGroup.belongsToMany(User, { through: 'UserGroupLink' })
User.belongsToMany(UserGroup, { through: 'UserGroupLink' })
Presentation.belongsToMany(UserGroup, { through: 'PresentationUserGroupLink' })
UserGroup.belongsToMany(Presentation, { through: 'PresentationUserGroupLink' })

sequelize
  .sync({ force: true })
  .then(() => console.log("users table has been successfully created, if one doesn't exist"))
  .then(() => UserGroup.findOrCreate({ where: { name: 'Green Team' } }))
  .then(() => UserGroup.findOrCreate({ where: { name: 'Blue Team' } }))
  .then(() =>
    Presentation.findOrCreate({
      where: { name: 'Test text file', filePath: './storage/uploads/test.txt' }
    })
  )
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
    }).then(user =>
      UserGroup.findAll().then(groups => Promise.all(groups.map(group => user.addUserGroup(group))))
    )
  )
  .then(() =>
    User.findOne({
      where: {
        name: 'serg'
      }
    }).then(user =>
      UserGroup.findAll().then(groups => Promise.all(groups.map(group => user.addUserGroup(group))))
    )
  )
  .catch(error => console.log('This error occured', error))

module.exports = {
  User,
  UserGroup,
  UserGroupLink,
  Presentation
}
