function error (error,req,res,next){

 

  // Deal with Mongoose Validation Error
  if(error.name === 'ValidationError'){
    const err = Object.values(error.errors).map(err=>err.message).join()
    return res.status(400).json({success:false,error:err})
  }

  if(error.code === 11000){
    return res.status(400).json({success:false,error:`${error.message};Duplicated key entered...,`})
  }
  

  if(error){
    // console.log('Stack')
    // console.log(error.stack)
    // console.log('Name')
    // console.log(error.name)
    // console.log('message')
    // console.log(error.message)
    
    return res.status(error.statusCode||500).json({success:false,error:error.message})
  }
}

module.exports = error