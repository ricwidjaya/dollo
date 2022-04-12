const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const { User } = require('../models')

function cookieExtractor(req) {
  const token = req.cookies.token
  return token
}

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
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
