const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const { User } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken,
  secretOrKey: process.env.JWT_SECRET
}

passport.use(
  new JWTStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id, {
        attributes: {
          exclude: ['password']
        }
      })

      return done(null, user)
    } catch (error) {
      done(error)
    }
  })
)

module.exports = passport
