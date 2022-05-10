const express = require('express')
const router = express.Router()
const { checkRole } = require('../../../helpers/auth')

router.get('/', (req, res, next) => {
  const role = checkRole(req)
  return res.render('announcements/show', {
    style: 'announcements',
    script: 'announcements',
    role
  })
})

router.get('/archived', (req, res, next) => {
  const role = checkRole(req)
  return res.render('announcements/archived', {
    style: 'announcements',
    script: 'archived',
    role
  })
})

router.get('/new', (req, res, next) => {
  const role = checkRole(req)
  return res.render('announcements/form', {
    script: 'announce-form',
    role
  })
})

router.get('/:id/edit', (req, res, next) => {
  const { id } = req.params
  const role = checkRole(req)
  return res.render('announcements/form', {
    script: 'announce-form',
    id,
    role
  })
})

module.exports = router
