const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  return res.render('index', {
    script: 'index'
  })
})

module.exports = router
