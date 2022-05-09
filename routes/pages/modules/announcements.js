const express = require('express')
const router = express.Router()
const { checkRole } = require('../../../helpers/auth')

router.get('/', (req, res, next) => {
  const role = checkRole(req)
  return res.render('announcements/show', {
    script: 'announcements',
    role
  })
})

router.get('/archived', (req, res, next) => {
  
})

router.get('/new', (req, res, next) => {
  const role = checkRole(req)
  return res.render('announcements/form', {
    script: 'announce-form',
    role
  })
})

router.get('/:id/edit', (req, res, next) => {
  const role = checkRole(req)
  return res.render('announcements/form', {
    script: 'announce-form',
    role
  })
})

module.exports = router
