function logErrors(err, req, res, next) {
  global.console.error(err.stack)
  next(err)
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}
function errorHandler(err, req, res) {
  res.status(500)
  res.render('error', { error: err })
}

function sessionChecker(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard')
  } else {
    next()
  }
}

module.exports = {
  logErrors,
  clientErrorHandler,
  errorHandler,
  sessionChecker
}
