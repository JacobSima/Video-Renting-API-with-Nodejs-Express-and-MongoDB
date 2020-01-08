
const Genre = require('../models/Genre')
const mongoose = require('mongoose')
const errorResponse =  require('../utils/errorResponse')
const asyncHandler = require('../utils/asynHandler')
const {genreCreateValidation,genreUpdateValidation} = require('../validations/genre')

//@ desc    Get all Genre
//@ route   GET /api/v1/genre
//@ access  Public
exports.getGenres = asyncHandler(async(req,res,next)=>{
    const genres =  await Genre.find().populate('movies')
    res.status(200).json({success:true,data:genres})
})




//@ desc    Get a signle Genre
//@ route   GET /api/v1/genre/:id
//@ access  Public
exports.getGenre = asyncHandler(async(req,res,next)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {return next(new errorResponse(` ${req.params.id} is not a valid objectId`,400))}

    const genre = await Genre.findById(req.params.id).populate('movies')

    if(!genre){return next(new errorResponse(`Genre with the id of ${req.params.id} was not found`,401))}

    res.status(200).json({success:true,data:genre})
  
})


//@ desc    Create a Genre
//@ route   POST /api/v1/genre
//@ acces   Private  
exports.createGenre = asyncHandler(async(req,res,next)=>{

    // User input Validation
    const err = await genreCreateValidation(req.body)
    if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

    const genre = await Genre.create(req.body)
    res.status(200).json({success:true,data:genre})
  
})

//@ desc    Update Genre
//@ route   PUT /api/v1/genre/:id
//@ access  Private
exports.updateGenre =asyncHandler(async(req,res,next)=>{

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {return next(new errorResponse(` ${req.params.id} is not a valid objectId`,400))}

    // User input Validation
    const err = await  genreUpdateValidation(req.body)
    if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

    const genre = await Genre.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

    if(!genre){return next(new errorResponse(`Genre with the id of ${req.params.id} was not found`,401))}


    res.status(200).json({success:true,data:genre})  
})


//@ desc    Delete Delete Genre
//@ route   DELETE /api/v1/genre/:id
//@ access  Private
exports.deleteGenre = asyncHandler(async(req,res,next)=>{

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {return next(new errorResponse(` ${req.params.id} is not a valid objectId`,400))}

   const genre =  await Genre.findById(req.params.id)
   genre.remove()

    res.status(200).json({success:true,data:{}})
})    

