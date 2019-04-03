// const { getAllUsers } = require('../../db')

function APIHandler(req, res, parsedUrl) {
  console.log(parsedUrl)
  // res.setHeader('Content-Type', 'application/json')
  // return getAllUsers().then(users => res.send(JSON.stringify(users, null, ' ')))
}
module.exports = { APIHandler }
