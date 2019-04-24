const { parse } = require('url')
const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const port = parseInt(global.process.env.PORT, 10) || 3001
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const { UserGroup, User, UserGroupLink, Presentation } = require('./models')
const { logErrors, clientErrorHandler, errorHandler, sessionChecker } = require('./utils')
const storage = require('./storage')(multer)

/*
 * @todo Нужно добавить схемы User UserGroup по https://docs.swagger.io/spec.html#5-schema
 */

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

server.get('/upload', (req, res) => {
  res.render('upload')
})

server.post('/upload', multer({ storage }).single('file'), async (req, res) => {
  const filePath = `${req.file.destination}/${req.file.filename}`
  await Presentation.create({ filePath })
})

// server.get('/API', (req, res) => {
//   const parsedUrl = parse(req.url, true)
//   return APIHandler(req, res, parsedUrl)
// })

server.get('/', sessionChecker, (req, res) => {
  res.redirect('/login')
})

server
  .route('/signup')
  .get(sessionChecker, (req, res) => {
    res.render('signup')
  })
  .post((req, res) => {
    User.create({
      user: req.body.name,
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
    res.render('login')
  })
  .post((req, res) => {
    var username = req.body.username,
      password = req.body.password

    User.findOne({ where: { name: username } }).then(function(user) {
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
    res.render('dashboard', { userName: req.session.user.name })
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

server.get('/db-list', (req, res) => {
  User.findAll()
    .then(users => users)
    .then(users => UserGroup.findAll().then(groups => ({ users, groups })))
    .then(result => UserGroupLink.findAll().then(links => ({ ...result, links })))
    .then(result => Presentation.findAll().then(pres => ({ ...result, pres })))
    .then(result => {
      result.groups.map(group => group.getUsers().then(users => console.dir(users)))
      return result
    })
    .then(result => {
      res.render('db-list', {
        users: result.users.map(u => JSON.stringify(u, null, ' ')),
        groups: result.groups.map(g => JSON.stringify(g, null, ' ')),
        pres: result.pres.map(g => JSON.stringify(g, null, ' ')),
        links: result.links.map(g => JSON.stringify(g, null, ' '))
      })
    })
})

server.get('/user-groups', (req, res) => {})
// /api/*** */
require('./routes/api')(server, User, UserGroup)
require('./routes/graphql/graphql')(server, User)
// const models = {
//   user: User,
//   'user-group': UserGroup
// }

// server.get('/api/:model/:id', (req, res, next) => {
//   console.log(req.params)
//   models[req.params.model]
//     .findAll(req.params.id === 'all' ? {} : { where: { id: req.params.id } })
//     .then(result => {
//       console.log(result)
//       res.json(result)
//     })
// })

// server.get( '/student/:student_id/course/:course_id/subject/:subjectId', function(req, res, next) {
//   Subjects.find({
//       where: {
//           'id': req.params.subjectId,
//           'courses.id': req.params.course_id,
//           'student_id.id': req.params.student_id
//       },
//       include: [{
//           model: Courses,
//           include: [{
//               model: Student
//           }]
//       }]
//   }).success(function(results) {
//       console.log(results);
//   });
// });

// route for handling 404 requests(unavailable routes)
server.use(function(req, res) {
  res.status(404).send("Sorry can't find that!")
})
server.use(errorHandler)

server.listen(port, err => {
  if (err) throw err
  global.console.log(`> Ready on http://localhost:${port}`)
})
