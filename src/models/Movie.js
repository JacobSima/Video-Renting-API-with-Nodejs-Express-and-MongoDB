const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({

  title:{
    type:String,
    minlength:3,
    maxlength:1024,
    trim:true,
    unique:true,
    required:[true,'Please provide movie title']
  },
  genre:{
    type:mongoose.Schema.ObjectId,
    ref:'Genre',
    required:[true,'Please attach genre type in this movie']
  },
  numberInStock:{
    type:Number,
    required:[true,'Please add the number in stock']
  },
  numberOutStock:{
    type:Number,
    default:0
  },
  dailyRentalRate:{
    type:Number,
    required:[true,'Please add daily rental']
  }

},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})





const Movie = mongoose.model('Movie',movieSchema)
module.exports = Movie