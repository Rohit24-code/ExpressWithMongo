class AppError extends Error {
  constructor(message,statusCode){
    //we are using super bcs we are extending this from Error class so that it activate its contructor too and it takes message as input
    super(message)
    this.statusCode=statusCode;
    this.status= `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports= AppError