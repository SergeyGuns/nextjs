const { parse } = require('url')
const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const port = parseInt(global.process.env.PORT, 10) || 8080
const { APIHandler } = require('./modules/API')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const User = require('./models/User')
const { logErrors, clientErrorHandler, errorHandler, sessionChecker } = require('./utils')
server.use(bodyParser.json())
server.use(bodyParser.urlencoded())
server.use(cookieParser())
server.use(logErrors)
server.use(clientErrorHandler)
server.set('view engine', 'pug')
server.set('views', __dirname + '/pug')
server.use(
  cookieSession({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
)

server.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid')
  }
  next()
})
// server.post('/auth', (req, res) => {})

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
    global.console.log('post::signup:: ', req.body)
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      .then(user => {
        req.session.user = user.dataValues
        res.redirect('/dashboard')
      })
      .catch(() => {
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

server.get('/user-list', (req, res) => {
  User.findAll().then(users => {
    // projects will be an array of all Project instances
    res.render('user-list', { users })
  })
})

// route for handling 404 requests(unavailable routes)
server.use(function(req, res) {
  res.status(404).send("Sorry can't find that!")
})
server.use(errorHandler)

server.listen(port, err => {
  if (err) throw err
  global.console.log(`> Ready on http://localhost:${port}`)
})
