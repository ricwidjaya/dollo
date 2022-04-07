const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  return res.render('index', {
    script: 'index',
    route: 'index'
  })
})

router.get('/login', (req, res, next) => {
  return res.render('login', {
    layout: 'user-auth',
    style: 'sign'
  })
})

module.exports = router
