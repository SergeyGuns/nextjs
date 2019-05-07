import { User } from '../models'

const getAPIKey = (req, res, next) => {
  const { username, password } = req.body

  User.findOne({ where: { name: username } }).then(function(user) {
    if (!user) {
      res.json({ message: 'no valid' })
    } else if (!user.validPassword(password)) {
      res.json({ message: 'no valid' })
    } else {
      req.session.user = user.dataValues
      res.redirect('/dashboard')
    }
  })
}

const createUser = (req, res, next) => {
  User.findOrCreate({
    where: {
      ...req.body
    }
  })
    .then(user => {
      res.json(user)
    })
    .catch(err => next(err))
}

var updateUser = function(req, res, next) {
  // User.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, user) {
  //   if (err) {
  //     next(err);
  //   } else {
  //     res.json(user);
  //   }
  // });
  User.findOne({ where: { id: req.body._id } }).updateUser
}

var deleteUser = function(req, res, next) {
  req.user.remove(function(err) {
    if (err) {
      next(err)
    } else {
      res.json(req.user)
    }
  })
}

var getAllUsers = function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      next(err)
    } else {
      res.json(users)
    }
  })
}

var getOneUser = function(req, res) {
  res.json(req.user)
}

var getByIdUser = function(req, res, next, id) {
  User.findOne({ _id: id }, function(err, user) {
    if (err) {
      next(err)
    } else {
      req.user = user
      next()
    }
  })
}

export { createUser }
