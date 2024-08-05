const AppError = require("./../utils/appError")

const handleCastErrorDB = err =>{
    const message = `Invalid ${err.path}:${err.value}`
    return new AppError(message,400)
}

const sendErrorProd= (err,res)=>{
     // operational error , trusted error
     if(err.isOperational){
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    }else{
            console.log(err,"error from errorController")
            //programming or other unknown error don't leak error details
            res.status(500).json({
                status:'error',
                message:'Something went very wrong!'
            })
    }
}

const sendErrorDev = (err,res) => {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error:err,
            stack:err.stack
          }) 
}

module.exports = ((err,req,res,next)=>{
    // console.log(err.stack)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

      if(process.env.NODE_ENV==="development"){
        sendErrorDev(err,res)
      }else if(process.env.NODE_ENV==="production"){
        let error= {...err}
        if(error.name==="CastError") error =  handleCastErrorDB(error)
        sendErrorProd(error,res)
      }

    //TODO last few video are left to implement
  })