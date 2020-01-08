const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')
const RentalOut = require('../models/RentalOut')
const Customer = require('../models/Customer')
const Movie = require('../models/Movie')
const mongoose = require('mongoose')
const {rentalOutCreateValidation} = require('../validations/rentalout')

//@ desc    Get all Rental out movies
//@ route   GET /api/v1/rental/out
//@ access  Private
exports.getRentalOuts = asyncHandler(async(req,res,next)=>{
  const rentalOuts = await RentalOut.find()
  res.status(200).json({success:true,data:rentalOuts})
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

