const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const PORT = process.env.PORT
const handlebars = require('express-handlebars')
const { api, pages } = require('./routes')

// Set view engine
app.engine('hbs', handlebars.engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))

// http

app.use('/api', api)
app.use('/', pages)

app.listen(PORT, () => {
  console.log(`Dollo is running on port ${PORT} with love.`)
})
