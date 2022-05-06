const { AuthenticationError } = require('apollo-server-express')
const passport = require('../config/passport')
const jwt = require('jsonwebtoken')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      throw new AuthenticationError('Jwt token not found.')
      // Think about it...wah??
      next()
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
  const token = req.cookies.token || ''
  if (token) {
    const auth = jwt.verify(token, process.env.JWT_SECRET)
    if (auth) {
      return res.redirect('/')
    }
  }
  next()
}

const checkRole = req => {
  const token = req.cookies.token || ''
  if (token) {
    const auth = jwt.verify(token, process.env.JWT_SECRET)

    // If role equals 0, the user is manager
    if (!auth.role) return 'manager'

    return 'member'
  }
}

module.exports = { authenticated, pageAuth, isLoggedIn, checkRole }
