const asyncHandler = require('../utils/asynHandler')
const errorResponse = require('../utils/errorResponse')
const Movie = require('../models/Movie')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Genre = require('../models/Genre')
const {movieCreateValidation,movieUpdateValidation} =  require('../validations/movie')


//@ desc    Get all movies
//@ route   Get /api/v1/movies
//@ access  Public
exports.getMovies = asyncHandler(async(req,res,next)=>{

  let queryStr =  {...req.query}
  let queryCall

  const queryToremove = ['sort','select','limit','page']

  queryToremove.forEach(param=> delete queryStr[param])

  queryStr = JSON.stringify(queryStr)

  // Create operators ($gt,$gte,lt,lte,in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`)

   queryCall = Movie.find(JSON.parse(queryStr)).populate('genre')

 if(req.query.select){
   const fields =  req.query.select.split(',').join(' ')
   queryCall.select(fields)
 }

 if(req.query.sort){
   const sortBy = req.query.sort.split(',').join(' ')
   queryCall.sort(sortBy)
 }else{
   queryCall.sort('dailyRentalRate')
 }

 //count the total number of documents before implimenting pagination
 const entries =  await queryCall
 // pagination
 const page = req.query.page || 1
 const limit = req.query.limit || 2
 const total = entries.length


  const movies = await queryCall
  res.status(200).json({sucess:true,data:movies,count:total})
})



//@ desc    Get single movie
//@ route   Get /api/v1/movies/:id
//@ access  Public
exports.getMovie = asyncHandler(async(req,res,next)=>{
  
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a valid Object Id`,400))
  }

  const movie = await Movie.findById(req.params.id).populate('genre')
  
  if(!movie){
    return next(new errorResponse(`Not movie found with the id of ${req.params.id}`,404))
  }

   res.status(200).json({sucess:true,data:movie})
})



//@ desc    Create single movie
//@ route   POST /api/v1/movies
//@ access  Private
exports.createMovie = asyncHandler(async(req,res,next)=>{

   // User input Validation
   const err = await movieCreateValidation(req.body)
   if(err){return next(new errorResponse(`${err.details[0].message}`,400))}
 

  if(!mongoose.Types.ObjectId.isValid(req.body.genre)){
    return next(new errorResponse(`${req.body.genre} is not a valid Object Id`,400))
  }

  // check if the genre is in the DB
  const genre = await Genre.findById(req.body.genre) 
  if(!genre){return  next(new errorResponse(`Unable to create movie of the genre with id of: ${req.body.genre}; genre does not exist`,400))}

  // create movie
  const movie = await Movie.create(req.body)
  
  //create movie file if one exists already then delete then create a new one
  fs.mkdirSync(path.join(__dirname,'..','..','public/movies',`${movie._id}`),{ recursive: true },0o776)


  res.status(200).json({sucess:true,data:movie})
  })



//@ desc    Update single movie
//@ route   PUT /api/v1/movies/:id
//@ access  Private
exports.updateMovie = asyncHandler(async(req,res,next)=>{

  // User input Validation
  const err = await movieUpdateValidation(req.body)
  if(err){return next(new errorResponse(`${err.details[0].message}`,400))}

  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a valid Object Id`,400))
  }
  

  const movie = await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

  if(!movie){
    return next(new errorResponse(`Not movie found with the id of ${req.params.id}`,404))
  }

   res.status(200).json({sucess:true,data:movie})

  })


//@ desc    Delete single movie
//@ route   Delete /api/v1/movies/:id
//@ access  Private
exports.deleteMovie = asyncHandler(async(req,res,next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new errorResponse(`${req.params.id} is not a valid Object Id`,400))
  }
  await Movie.findByIdAndRemove(req.params.id)
  
  // Remove directory
  fs.rmdirSync(path.join(__dirname,'..','..','public/movies',`${req.params.id}`),{ recursive: true })
  
  res.status(200).json({sucess:true,data:{}})
  })



