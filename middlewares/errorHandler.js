//* ~ Found Page
const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`)
    res.status(404)
    next(error)
}

//* Error Handler for Api's
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode == 200 ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message: err?.message,
        stack: err?.stack,
    })
}

module.exports = {
    notFound,
    errorHandler
}