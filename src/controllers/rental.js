const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')
const RentalOut = require('../models/RentalOut')
const RentalIn = require('../models/RentalIn')
const Customer = require('../models/Customer')
const Movie = require('../models/Movie')
const mongoose = require('mongoose')
const {rentalOutCreateValidation,rentalInCreateValidation} = require('../validations/rental')

//@ desc    Get all Rental out movies
//@ route   GET /api/v1/rental/out
//@ access  Private
exports.getRentalOuts = asyncHandler(async(req,res,next)=>{
  const rentalOuts = await RentalOut.find().populate({path:'movie',select:'title'}).populate({path:'customer',select:'name email'})

  res.status(200).json({success:true,data:rentalOuts})
})

//@ desc    Get a single Rental out movie
//@ route   GET /api/v1/rental/out/:id
//@ access  Private
exports.getRentalOut = asyncHandler(async(req,res,next)=>{

  // validate mongoose objectid types
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`The rental out id of: ${req.params.id} is not a valid mongoose id`,400))
  }

  const rentalOut = await RentalOut.findById(req.params.id)
  res.status(200).json({success:true,data:rentalOut})
})


//@ desc    Create a rental out movie
//@ route   POST /api/v1/rental/out
//@ access  Private
exports.createRentalOut = asyncHandler(async(req,res,next)=>{

   // User input Validation
    const err = await rentalOutCreateValidation(req.body)
    if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

  // validate mongoose objectid types
   if(!mongoose.Types.ObjectId.isValid(req.body.customer)){
     return next(new errorResponse(`The customer id of: ${req.body.customer} is not a valid mongoose id`,400))
   }
   const customer = await Customer.findById(req.body.customer)
   if(!customer){
    return next(new errorResponse(`The customer id of: ${req.body.customer} is not found`,404))
   }

   if(customer.fined){
    return next(new errorResponse(`the customer is fined with the amount of: ${customer.finedAmount} Please settle this before renting out a new movie `,400))
   }

   if(!mongoose.Types.ObjectId.isValid(req.body.movie)){
     return next(new errorResponse(`The movie id of: ${req.body.movie} is not a valid mongoose id`,400))
   }
   const movie = await Movie.findById(req.body.movie)
   if(!movie){
    return next(new errorResponse(`The movie id of: ${req.body.movie} is not found`,404))
  }

   // a single movie per customer
   const rental = await RentalOut.findOne({customer:req.body.customer})
   if(rental){
     if(rental.movie.toString() === req.body.movie){
       return next(new errorResponse(`Customer already rented this movie,Maximum of one per movie`,400))
     }
   }
  
   // one customer can only rent a maximum of 3 movies
   if(customer.takenMovie.length >= 3){
    return next(new errorResponse(`Maximum rental limit of 3 reached`,400))
  }

  //check numberinStock field
   if(movie.numberInStock === 0){
     return next(new errorResponse(`Movie out of Stock`,400))
  }

  // save the rental
  const rentalOut = await RentalOut.create(req.body)

  res.status(200).json({success:true,data: rentalOut})
})


//@ desc    Get all Rental In movies
//@ route   GET /api/v1/rental/in
//@ access  Private
exports.getRentalIns = asyncHandler(async(req,res,next)=>{
  const rentalIns = await RentalIn.find().populate('rentalOut')

  res.status(200).json({success:true,data:rentalIns})
})


//@ desc    Get a Single Rental In movie
//@ route   GET /api/v1/rental/in/:id
//@ access  Private
exports.getRentalIn = asyncHandler(async(req,res,next)=>{
   // validate mongoose objectid types
   if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`The customer id of: ${req.params.id} is not a valid mongoose id`,400))
  }

  const rentalIn = await RentalIn.findById(req.params.id).populate('rentalOut')

  res.status(200).json({success:true,data:rentalIn})
})


//@ desc    Create a ReturnIn movie
//@ route   POST /api/v1/rental/in
//@ access  Private
// redirect to the customer page from front-end
exports.createRentalIn = asyncHandler(async(req,res,next)=>{
  
  // User input Validation
  const err = await rentalInCreateValidation(req.body)
  if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

  // validate mongoose objectid types
  if(!mongoose.Types.ObjectId.isValid(req.body.rentalOut)){
    return next(new errorResponse(`The RentalOut id of: ${req.body.rentalOut} is not a valid mongoose id`,400))
  }
   const returnIn = await RentalIn.create(req.body)
  
   // update customer fields, fined and fineAmount
   await returnIn.updateFields(returnIn)

  res.status(200).json({success:true,data:returnIn})
})

