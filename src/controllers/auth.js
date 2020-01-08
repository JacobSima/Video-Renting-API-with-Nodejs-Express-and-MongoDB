const mongoose = require('mongoose')
const User = require('../models/User')
const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')
const {authCreateValidation,loginValidation,authUpdateDetails,authUpdatePassword,forgotPassword,resetPassword} = require('../validations/auth')
const sendEmail = require('../utils/passwordResetMail')
const crypto = require('crypto')


//@ desc    login user
//@ route   Post /api/v1/auth/login
//@ access  Public
exports.login = asyncHandler(async(req,res,next)=>{
   // User input Validation
   const err = await loginValidation(req.body)
   if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

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


//@ desc    Create User
//@ route   POST /api/v1/auth/users
//@ access  Public/private
exports.createUser =  asyncHandler(async(req,res,next)=>{

  // User input Validation
  const err = await authCreateValidation(req.body)
  if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

  // admin role can only be create by the admin
  // this is to force the default customer role if admin is supplied
  
  let newBody = {...req.body}
  if(newBody.role === 'admin'){ newBody.role = undefined}
  if(req.user){
    if(req.user.role === 'admin' && req.body.role === 'admin'){newBody.role = 'admin'}
  }

   let user = await User.create(newBody)
   sendTokenResponse(user,200,res)
})



// @desc  Update user details
//@route  PUT/api/v1/auth/updatedetails
//@access Private
exports.updateDetails = asyncHandler(async(req,res,next)=>{
  // user can update his name or email
  // User input Validation
  const err = await authUpdateDetails(req.body)
  if(err){return next(new errorResponse(`${err.details[0].message}`,400))}


  const user = await User.findByIdAndUpdate(req.user._id,req.body,{new:true,runValidators:true})
  if(user.customer){
    await req.user.updateCustomerEmail(user.customer,user.email,user.name)
    }

  sendTokenResponse(user,200,res)
})


// @desc  Update user password
//@route  PUT/api/v1/auth/updatePassword
//@access Private
exports.updatePassword = asyncHandler(async(req,res,next)=>{
  // User input Validation
  const err = await authUpdatePassword(req.body)
  if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

  // check if odl password is valid
   let user =  await User.findById(req.user._id).select('+password')
   const isValid =  await user.validateHash(req.body.oldPassword)
   if(!isValid){return next(new errorResponse(`Wrong Old password provided`,400))}
   
   user.password = req.body.newPassword
   user = await user.save()
  sendTokenResponse(user,200,res)
})


// @desc  Forgot password
//@route  POST/api/v1/auth/forgotPassword
//@access Private
exports.forgotPassword = asyncHandler(async(req,res,next)=>{
  // User input Validation
  const err = await forgotPassword(req.body)
  if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

  let user = await User.findOne({email:req.body.email})
  if(!user){return next(new errorResponse(`Email of: ${req.body.email} not found`,404))}

  // Get the reset Token
  const resetToken = user.getResetToken()
  // save this user with resetPassword Token hashed and resetPasswordToen expire time
  await user.save()

  // Create reset url
  const resetUrl = `${req.protocol}://${req.headers.host}/api/v1/auth/resetpassword/${resetToken}`


  // create message to send
  const message = `
    You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to : \n\n ${resetUrl}
  `
  try {

    await sendEmail({
      email:user.email,
      subject:'Password Reset Token',
      message
    })
    res.status(200).json({success:true,data:'Email Sent'})
  } catch (error) {
    console.log(error)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({validateBeforeSave:false})
    return next(new errorResponse('Email could not be sent',500))
  }
  
})

// @desc  Reset password
//@route  PUT/api/v1/auth/resetpassword
//@access Public
exports.resetPassword = asyncHandler(async(req,res,next)=>{
  // User input Validation
  const err = await resetPassword(req.body)
  if(err){return next(new errorResponse(`${err.details[0].message}`,400))}
  
  // get the resetPasswordToken from the same crypto algo used
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.id).digest('hex')
  let user =  await User.findOne({resetPasswordToken })
  if(!user){return next(new errorResponse(`User not found,resetPasswordToken not found in DB`,404))}

  user.password = req.body.password
  user.resetPasswordExpire = undefined
  user.resetPasswordToken = undefined
  
  user = await user.save()
  sendTokenResponse(user,200,res)
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