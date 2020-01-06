const mongoose = require('mongoose')
const User = require('../models/User')
const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')

//@ desc    login user
//@ route   Post /api/v1/auth/login
//@ access  Public
exports.login = asyncHandler(async(req,res,next)=>{
   const {email,password} = req.body

   const user = await User.findOne({email}).select('+password')
   if(!user){return next(new errorResponse(`Email of ${req.body.email} not found`,404))}
   

   const isValid =  await user.validateHash(password)
  
   if(!isValid){return next(new errorResponse(`Wrong password`,400))}
   
    // send token  response
    sendTokenResponse(user,200,res)

})


//@ desc    Get current user
//@ route   Get /api/v1/auth/me
//@ access  Private
exports.getMe = asyncHandler(async(req,res,next)=>{
   const user = await User.findById(req.user._id)
   res.status(200).json({success:true,data:user})
})


// @desc  logout and clear cookies, this is used only when cookies is enable in the auth middleware
//@route  get/api/v1/auth/logout
//@access Private
exports.logout = asyncHandler(async(req,res,next)=>{

  res.cookie('token','none',{
    expires:new Date(Date.now()+10*1000),
    httpOnly:true
  })

  res.status(200).json({
    success:true,
    data:{}
  })
})










// get token from model and create cookie and send response
const sendTokenResponse = async (user,statusCode,res)=>{
   // Create toke
   const token = await user.signInToken() 
   const options = {
     expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
     httpOnly:true
   }
  
  if(process.env.NODE_ENV === 'production'){
    options.secure =true
  }
  
   res
    .status(statusCode)
    .cookie('token',token,options)
    .json({success:true,token})
  
  }