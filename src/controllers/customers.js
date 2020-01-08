const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')
const Customer = require('../models/Customer')
const mongoose = require('mongoose')
const {customerCreateValidation,customerUpdateValidation} = require('../validations/customer')

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
 // User input Validation
 const err = await customerCreateValidation(req.body)
 if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

  const customer = await Customer.create(req.body)
  res.status(200).json({success:true,data:customer})
})


//@ desc    Update  Customer
//@ route   PUT /api/v1/customers/:id
//@ access  Private

exports.updateCustomer = asyncHandler( async(req,res,next)=>{
  // User input Validation
  const err = await customerUpdateValidation(req.body)
  if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a value id`,400))
  }

  const newRequest = {...req.body}
  const removedFields = ['address']
  removedFields.forEach(param=> delete newRequest[param])

  let customer = await Customer.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

  if(!customer){
    return next (new errorResponse(`Not customer found with the id of: ${req.params.id}`,400))
  }

  // call save middleware to update the location from the geocode  function and user email 
  customer = await customer.save()

  res.status(200).json({succes:true,data:customer})
})

//@ desc    Delete a single Customer
//@ route   DELETE /api/v1/customers/:id
//@ access  Private

exports.deleteCustomer = asyncHandler(async(req,res,next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a value id`,400))
  }
  
  const customer = await Customer.findById(req.params.id)

  if(!customer){
    return next (new errorResponse(`Not customer found with the id of: ${req.params.id}`,400))
  }

  customer.remove()

  res.status(200).json({succes:true,data:{}})
})