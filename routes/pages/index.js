const express = require('express')
const router = express.Router()
const { pageAuth, isLoggedIn, checkRole } = require('../../helpers/auth')

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

module.exports = router
