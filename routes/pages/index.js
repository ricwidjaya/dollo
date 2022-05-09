const express = require('express')
const router = express.Router()
const {
  pageAuth,
  isLoggedIn,
  checkRole,
  blockRole
} = require('../../helpers/auth')

const announcements = require('./modules/announcements')

router.use('/announcements', blockRole('member'), announcements)

router.get('/signin', isLoggedIn, (req, res, next) => {
  return res.render('signin', {
    layout: 'user-auth',
    style: 'sign',
    script: 'signin'
  })
})

router.get('/signup', isLoggedIn, (req, res, next) => {
  return res.render('signup', {
    layout: 'user-auth',
    style: 'sign',
    script: 'signup'
  })
})

router.get('/logout', (req, res, next) => {
  res.clearCookie('token')
  return res.redirect('/signin')
})

router.get('/', pageAuth, (req, res, next) => {
  const role = checkRole(req)
  return res.render('index', {
    script: 'index',
    route: 'index',
    role
  })
})

router.get('*', (req, res, next) => {
  const role = checkRole(req)
  return res.status(404).render('404', {
    style: '404',
    role
  })
})

module.exports = router
