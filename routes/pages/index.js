const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  return res.render('index', {
    script: 'index',
    route: 'index'
  })
})

router.get('/tasks', (req, res, next) => {
  return res.render('tasks', {
    route: 'tasks'
  })
})

module.exports = router
