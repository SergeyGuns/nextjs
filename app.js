const { createServer } = require('http')
const { parse } = require('url')
const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const { APIHandler } = require('./modules/API')

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json())
  server.post('/auth', (req, res) => {})

  server.get('/API', (req, res) => {
    const parsedUrl = parse(req.url, true)
    return APIHandler(req, res, parsedUrl)
  })

  server.get('/', (req, res) => {
    return app.render(req, res, '/pages', req.query)
  })
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
