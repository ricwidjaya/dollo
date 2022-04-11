const { AuthenticationError } = require('apollo-server-express')
const passport = require('../config/passport')

const authenticated = req => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) throw new AuthenticationError('Jwt token not found.')
  })(req)
}

module.exports = { authenticated }
