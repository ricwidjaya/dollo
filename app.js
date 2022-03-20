const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const PORT = process.env.PORT
const handlebars = require('express-handlebars')

// Set view engine
app.engine('hbs', handlebars.engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', async (req, res, next) => {
  return res.render('index')
})

app.listen(PORT, () => {
  console.log(`Dollo is running on port ${PORT} with love.`)
})
