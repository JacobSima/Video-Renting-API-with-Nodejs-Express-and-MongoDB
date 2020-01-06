const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const mongoose = require('mongoose')

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


//@ desc    Create User
//@ route   POST /api/v1/auth/users
//@ access  Public
exports.createUser =  asyncHandler(async(req,res,next)=>{

  // admin role can only be create from database
  // this is to force the default customer role if admin is supplied
  let newBody = {...req.body}
  if(newBody.role === 'admin'){ newBody.role = undefined}

   let user = await User.create(newBody)
   user = {
     _id:user._id,
     role:user.role,
     name:user.name
   }
  res.status(201).json({success:true,data:user})
})



//@ desc    Update  User
//@ route   PUT /api/v1/auth/users/:id
//@ access  Private

exports.updateUser = asyncHandler( async(req,res,next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a value id`,400))
  }
 
   let user = await User.findById(req.params.id)

  if(!user){
    return next (new errorResponse(`Not user found with the id of: ${req.params.id}`,400))
  }

   await User.updateOne({_id:req.params.id},req.body)
   user = await User.findById(req.params.id)
   if(user.customer){user.updateCustomerEmail(user.customer,user.email)}

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