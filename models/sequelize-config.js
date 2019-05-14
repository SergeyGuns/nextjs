const Sequelize = require('sequelize')
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './db/database.sqlite'
// })
const sequelize = new Sequelize('mysql://serg:serg@10.100.10.213:3306/serg-test')

module.exports = sequelize
