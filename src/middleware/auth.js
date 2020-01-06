const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = asyncHandler( async(req,res,next)=>{
  let token

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }

 // for cookies
  //  else if(req.cookies.token){
  //    token = req.cookies.token
  //  }

  
  if(!token){
    return next(new errorResponse('Not authorize to access this route,token missing',401))
  }

  try {
    const decoded = await jwt.verify(token,process.env.JWT_SECRET) 
    if(!decoded){return next(new errorResponse('Wrong Token provided',401))}
    const user =  await User.findById(decoded.id)
    req.user = user
    
  } catch (error) {
    return next(new errorResponse(`${error.name} ;${error.message}`,401))
  }
  next()
})


exports.autorize = (...roles)=>{
  return (asyncHandler (async(req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new errorResponse(`User role ${req.user.role} is not autorized`,403))  //403 forbidden error
    }
    
    next()
  }))
}