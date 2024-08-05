const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const tourRouter = require("./routes/tourRoute.js")
const userRouter = require("./routes/userRoute.js")
const app = express();
const AppError = require("./utils/appError.js")
const globalErrorHandler = require("./controllers/errorController.js")


// 1. Middlewares
if(process.env.NODE_ENV==="development"){
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});



// 2. Routes

app.use("/api/v1/tours",tourRouter);
app.use("/api/v1/users",userRouter);

// if code reaches here it mean it doesnot go on any of this route
app.all('*', function(req,res,next){
  // const err = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.status="fail"
  // err.statusCode=404
  // whenever we will pass err in next it will reach to global error middleware by default 
  next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
})


//  this entire function here is a error handling middleware,
//  express knows it by having 4 params and first is err
app.use(globalErrorHandler)


module.exports=app
 

