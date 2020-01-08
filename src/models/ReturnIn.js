const mongoose = require('mongoose')
const Schema = mongoose.Schema

const returnMovieSchema = new Schema({

  customer:{
    type:mongoose.Schema.ObjectId,
    ref:'Customer',
    required:[true,'Please provide customer id']
  },
  movie:{
    type:mongoose.Schema.ObjectId,
    ref:'Movie',
    required:[true,'Please provide movie id']
  },
  dateIn:{
    type:Date,
    default:Date.now
  },
  fined:Number


})

const ReturnMovie =  mongoose.model('ReturnMovie',returnMovieSchema)
module.exports = ReturnMovie