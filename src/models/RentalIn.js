const mongoose = require('mongoose')
const Schema = mongoose.Schema
const errorResponse = require('../utils/errorResponse')

const RentalInSchema = new Schema({

  rentalOut:{
    type:mongoose.Schema.ObjectId,
    ref:'RentalOut',
    required:[true,'Please provide RentalOut id']
  },
  dateIn:{
    type:Date,
    default:Date.now
  }


})


RentalInSchema.pre('save',async function(next){
  const rentalOut = await this.model('RentalOut').findById(this.rentalOut )

  if(!rentalOut){
    return next(new errorResponse(`Not rentalOut Found with the id of:${this.rentalOut}`,400))
  }

  await this.model('Customer').findByIdAndUpdate(rentalOut.customer,{$pull:{takenMovie:rentalOut._id}})
  
  await this.model('Movie').findByIdAndUpdate(rentalOut.movie,{$inc:{numberInStock:1}})

  
  
})

RentalInSchema.methods.updateFields = async function(rentalIn){
  let fined

   const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
   const dateIn = rentalIn.dateIn
   const rentalOut =  await this.model('RentalOut').findById(rentalIn.rentalOut)
   const customer = await this.model('Customer').findById(rentalOut.customer).select(' membership')   
   const movie =  await this.model('Movie').findById(rentalOut.movie).select(' dailyRentalRate')
   const dateToReturn = rentalOut.returnDate
   const dateOut = rentalOut.dateOut

   const daysToBeOut = Math.abs((dateOut - dateToReturn) / oneDay)
   const daysExceed = ((dateIn-dateToReturn) / oneDay)

   //update customer with fined and finedAmount values
   if(daysExceed > 0){
    fined = await calculateFined(customer.membership, movie.dailyRentalRate,daysExceed)
    await this.model('Customer').findByIdAndUpdate(rentalOut.customer,{$set:{fined:true,finedAmount:fined}})
    
   }
    // Delete the rental out movie
    await this.model('RentalOut').findByIdAndDelete(this.rentalOut)
}




async function calculateFined(membership,dailyRentalRate,daysExceed){
  let rate
  if(membership === 'student'){
    rate = (dailyRentalRate*(1-(5/100))).toFixed(2)
  }else if (membership === 'standard'){
    rate = dailyRentalRate
  }else if(membership === 'premium'){
    rate = (dailyRentalRate*(1-(15/100))).toFixed(2)
  }
  return Math.round(((rate*daysExceed)/2))
}

const RentalIn =  mongoose.model('RentalIn',RentalInSchema)
module.exports = RentalIn


