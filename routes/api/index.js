const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

module.exports = (server, User, UserGroup) => {
  const models = {
    user: User,
    'user-group': UserGroup
  }

  // server.use('/api-docs', swaggerUi.serve, swaggerUi(swaggerDocument))

  server.get('/api/:model/:id', (req, res) => {
    console.log(req.params)
    models[req.params.model]
      .findAll(req.params.id === 'all' ? {} : { where: { id: req.params.id } })
      .then(result => {
        console.log(result)
        res.json(result)
      })
  })

  // server.put('/api/:model/', (req, res) => {
  //   models[req.params.model].findOrCreate({ where: { name } }).then(result => res.send(result))
  // })
  server.put('/api/', (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      next()
    } else {
      res.send('need auth')
    }
  })

  server.put('/api/:model', (req, res, next) => {
    // const { email, name, password } = req.body
    if (req.session.user && req.cookies.user_sid) {
      models[req.params.model]
        .findOrCreate({ where: { ...req.body } })
        .then(user => res.json(user))
        .catch(err => res.json(err))
    } else {
      res.send('need auth')
    }
  })
}
