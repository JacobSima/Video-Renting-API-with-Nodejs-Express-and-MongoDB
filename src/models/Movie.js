const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({

  title:{
    type:String,
    minlength:3,
    maxlength:1024,
    trim:true
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
  dailyRentalRate:{
    type:Number,
    required:[true,'Please add daily rental']
  },
  location:String

})





const Movie = mongoose.model('Movie',movieSchema)
module.exports = Movie