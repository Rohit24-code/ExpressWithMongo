module.exports= fn=>{
    return (req,res,next)=>{
        //this function will return a promise as it is async 
      fn(req,res,next).catch(err => next(err))
    }
    
  }