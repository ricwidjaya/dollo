const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  return res.json({
    status: 'success',
    message: 'Accessed Dollo API.'
  })
})

module.exports = router
