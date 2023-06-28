require('dotenv').config()
require('./config/dbConnnect')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const bodyParser = require('body-parser')
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()

//* for post request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false,
}))
app.use(cookieParser())

//* Routes
app.get('/', (req, res) => {
    res.send('We are in amazon!')
})
app.use('/api/user', require('./routes/authRoutes'))
app.use('/api/product', require('./routes/productRoutes'))

//* Error after all .use
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`http://127.0.0.1:${port}`))