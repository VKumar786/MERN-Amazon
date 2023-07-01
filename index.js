require('dotenv').config()
require('./config/dbConnnect')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const bodyParser = require('body-parser')
const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const app = express()

//* for post request
app.use(morgan("dev"))
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
app.use('/api/blog', require('./routes/blogRoutes'))
app.use('/api/productCategory', require('./routes/productCategoryRoutes'))
app.use('/api/blogCategory', require('./routes/blogCategoryRoutes'))
app.use('/api/brand', require('./routes/brandRoutes'))
app.use('/api/cupon', require('./routes/cuponRoutes'))

//* Error after all .use
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`http://127.0.0.1:${port}`))