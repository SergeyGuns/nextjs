const { parse } = require('url')
const express = require('express')
const server = express()
const next = require('next')
const bodyParser = require('body-parser')
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const morgan = require('morgan')
const handle = app.getRequestHandler()
const { APIHandler } = require('./modules/API')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const User = require('./models/User')
const { logErrors, clientErrorHandler, errorHandler } = require('./utils')
const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard')
  } else {
    next()
  }
}
app.prepare().then(() => {
  server.use(bodyParser.json())
  server.use(cookieParser())
  server.use(morgan('dev'))
  server.use(logErrors)
  server.use(clientErrorHandler)
  server.use(errorHandler)

  server.use(
    cookieSession({
      key: 'user_sid',
      secret: 'somerandonstuffs',
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 600000,
      },
    }),
  )
  server.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid')
    }
    next()
  })
  server.post('/auth', (req, res) => {})

  server.get('/API', (req, res) => {
    const parsedUrl = parse(req.url, true)
    return APIHandler(req, res, parsedUrl)
  })

  server.get('/', sessionChecker, (req, res) => {
    res.redirect('/login')
  })
  server
    .route('/signup')
    .get(sessionChecker, (req, res) => {
      res.sendFile(__dirname + '/public/signup.html')
    })
    .post((req, res) => {
      console.log(req.body)
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      })
        .then(user => {
          req.session.user = user.dataValues
          res.redirect('/dashboard')
        })
        .catch(error => {
          res.redirect('/signup')
        })
    })
  server
    .route('/login')
    .get(sessionChecker, (req, res) => {
      res.sendFile(__dirname + '/public/login.html')
    })
    .post((req, res) => {
      var username = req.body.username,
        password = req.body.password

      User.findOne({ where: { username: username } }).then(function(user) {
        if (!user) {
          res.redirect('/login')
        } else if (!user.validPassword(password)) {
          res.redirect('/login')
        } else {
          req.session.user = user.dataValues
          res.redirect('/dashboard')
        }
      })
    })
  server.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.sendFile(__dirname + '/public/dashboard.html')
    } else {
      res.redirect('/login')
    }
  })

  // route for user logout
  server.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid')
      res.redirect('/')
    } else {
      res.redirect('/login')
    }
  })

  // route for handling 404 requests(unavailable routes)
  server.use(function(req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
