const { AuthenticationError } = require('apollo-server-express')
const passport = require('../config/passport')
const jwt = require('jsonwebtoken')

const authenticated = (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      throw new AuthenticationError('Jwt token not found.')
    }
  })(req, res)
}

const pageAuth = (req, res, next) => {
  const token = req.cookies.token
  try {
    const auth = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    if (err) {
      return res.redirect('/signin')
    }
  }
  next()
}

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token
  try {
    const auth = jwt.verify(token, process.env.JWT_SECRET)
    if (auth) {
      return res.redirect('/')
    }
  } catch (err) {
    if (err) {
      return res.redirect('/signin')
    }
  }
  next()
}

module.exports = { authenticated, pageAuth, isLoggedIn }
