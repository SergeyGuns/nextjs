const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite',
})

const Model = Sequelize.Model
class User extends Model {}
User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
    },
    // attributes
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    job: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    token: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    // options
  },
)
User.sync()

User.findOrCreate({
  where: {
    firstName: 'Админ',
    isAdmin: true,
    email: 'mcheguevara2@gmail.com',
    password: '1234',
  },
  defaults: { job: 'something else' },
}).then(([user, created]) => {
  console.log(
    user.get({
      plain: true,
    }),
  )
  console.log(created)

  /*
    In this example, findOrCreate returns an array like this:
    [ {
        username: 'fnord',
        job: 'omnomnom',
        id: 2,
        createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
        updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
      },
      false
    ]
    The array returned by findOrCreate gets spread into its 2 parts by the array spread on line 3, and
    the parts will be passed as 2 arguments to the callback function beginning on line 69, which will
    then treat them as "user" and "created" in this case. (So "user" will be the object from index 0
    of the returned array and "created" will equal "false".)
    */
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

function getAllUsers() {
  return User.findAll()
}
module.exports = { getAllUsers }
