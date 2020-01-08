const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const mongoose = require('mongoose')
const {userUpdateValidation} = require('../validations/user')

//@ desc    Get all Users
//@ route   GET /api/v1/auth/users
//@ access  Private
exports.getUsers = asyncHandler(async(req,res,next)=>{
  const users = await User.find()
  res.status(200).json({
    success:true,
    data:users
  })
})

//@ desc    GET Single User
//@ route   GET /api/v1/auth/users/:id
//@ access  Private
exports.getUser =  asyncHandler(async(req,res,next)=>{

  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a value id`,400))
  }

  const user = await User.findById(req.params.id)
  if(!user){
    return next (new errorResponse(`Not user found with the id of: ${req.params.id}`,400))
  }

  res.status(200).json({succes:true,data:user})

})






//@ desc    Update  User
//@ route   PUT /api/v1/auth/users/:id
//@ access  Private

exports.updateUser = asyncHandler( async(req,res,next)=>{

  // User input Validation
  const err = await userUpdateValidation(req.body)
  if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a value id`,400))
  }
 
  let user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

  if(!user){
    return next (new errorResponse(`Not user found with the id of: ${req.params.id}`,400))
  }

   if(req.body.password){user.password = req.body.password}

    user = await user.save()
    
   if(user.customer){user.updateCustomerEmail(user.customer,user.email,user.name)}

  res.status(200).json({succes:true,data:user})
})



//@ desc    Delete Single User
//@ route   Delete /api/v1/auth/users/:id
//@ access  Private
exports.deleteUser =  asyncHandler(async(req,res,next)=>{

  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a value id`,400))
  }

  const user = await User.findByIdAndDelete(req.params.id)
  if(!user){
    return next (new errorResponse(`Not user found with the id of: ${req.params.id}`,400))
  }

  res.status(200).json({succes:true})

})