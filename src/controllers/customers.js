const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')
const Customer = require('../models/Customer')
const mongoose = require('mongoose')

//@ desc    Get all Customers
//@ route   GET /api/v1/customers
//@ access  Public
exports.getCustomers = asyncHandler( async(req,res,next)=>{
  const customers = await Customer.find()
  res.status(200).json({succes:true,data:customers})
})


//@ desc    GET Single Customer
//@ route   GET /api/v1/customers/:id
//@ access  Public
exports.getCustomer = asyncHandler(async (req,res,next)=>{

  
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a value id`,400))
  }
  
  const customer = await Customer.findById(req.params.id)

  if(!customer){
    return next (new errorResponse(`Not customer found with the id of: ${req.params.id}`,400))
  }

  res.status(200).json({succes:true,data:customer})
})

//@ desc    Create a Customer
//@ route   POST /api/v1/customers
//@ access  Private
exports.createCustomer = asyncHandler(async(req,res,next)=>{
  const customer = await Customer.create(req.body)
  res.status(200).json({success:true,data:customer})
})


//@ desc    Update  Customer
//@ route   PUT /api/v1/customers/:id
//@ access  Private

exports.updateCustomer = asyncHandler( async(req,res,next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a value id`,400))
  }
  
  const customer = await Customer.findByIdAndUpdate(req.params.id,req.body,{
    new:true,runValidators:true
  })

  if(!customer){
    return next (new errorResponse(`Not customer found with the id of: ${req.params.id}`,400))
  }

  res.status(200).json({succes:true,data:customer})
})

//@ desc    Delete a single Customer
//@ route   DELETE /api/v1/customers/:id
//@ access  Private

exports.deleteCustomer = asyncHandler(async(req,res,next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a value id`,400))
  }
  
  const customer = await Customer.findByIdAndDelete(req.params.id)

  if(!customer){
    return next (new errorResponse(`Not customer found with the id of: ${req.params.id}`,400))
  }

  res.status(200).json({succes:true,data:{}})
})