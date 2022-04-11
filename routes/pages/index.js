const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  return res.render('index', {
    script: 'index',
    route: 'index'
  })
})

router.get('/signin', (req, res, next) => {
  return res.render('signin', {
    layout: 'user-auth',
    style: 'sign',
    script: 'signin'
  })
})

router.get('/signup', (req, res, next) => {
  return res.render('signup', {
    layout: 'user-auth',
    style: 'sign',
    script: 'signup'
  })
})

module.exports = router
