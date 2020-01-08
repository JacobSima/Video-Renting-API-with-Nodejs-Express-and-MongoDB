const mongoose = require('mongoose')
const Schema = mongoose.Schema
const errorResponse = require('../utils/errorResponse')

const RentalOutSchema =  new Schema({
 
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
  dateOut:{
    type:Date,
    default:Date.now
  },
  returnDate:{    // to be calculate in front-end base on the customer membership and days.
    type:Date,
    required:[true,'Please provide date']
  }
    
})

// calculate the rentalFee, returnDate 
RentalOutSchema.pre('save',async function(next){
    await this.model('Customer').findByIdAndUpdate(this.customer,{$push:{takenMovie:this}})
    await this.model('Movie').findByIdAndUpdate(this.movie,{$inc:{numberInStock:-1}})
})






const RentalOut =  mongoose.model('RentalOut',RentalOutSchema)
module.exports = RentalOut