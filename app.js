const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const app = express()

// 1. middleware
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
//express.json is middleware
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
})
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// 3.Routes
// 實際上tourRouter, userRouter是中間件
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4. start server
module.exports = app;