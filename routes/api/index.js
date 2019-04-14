module.exports = (server, User, UserGroup) => {
  const models = {
    user: User,
    'user-group': UserGroup
  }

  server.get('/api/:model/:id', (req, res) => {
    console.log(req.params)
    models[req.params.model]
      .findAll(req.params.id === 'all' ? {} : { where: { id: req.params.id } })
      .then(result => {
        console.log(result)
        res.json(result)
      })
  })

  server.put('/api/:model/:name', (req, res) => {
    models[req.params.model].findOrCreate({ where: { name } }).then(result => res.send(result))
  })
}
