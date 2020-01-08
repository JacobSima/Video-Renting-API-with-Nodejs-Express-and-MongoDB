const mongoose = require('mongoose')
const Schema = mongoose.Schema
const geocoder = require('../utils/geocoder')

const customerSchema =  new Schema({

  name:{
    type:String,
    trim:true,
    minlength:3,
    maxlength:1024,
    required:[true,'Please provide customer name']
  },
  membership:{
    type:String,
    enum:['student','standard','premium'],
    default:'standard'
  },
  phone:{
    type:String,
    minlength:3,
    maxlength:1024,
    required:[true,'Please provide a phone number']
  },
  email:{
    type:String,
    unique:[true,'email already exists'],
    lowercase:true,
    trim:true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  address:{
    type:String,
    minlength:5,
    maxlength:1025,
    required:[true,'Please provide your address']
  },
  location:{
    type:{
      type:String,
      enum:['Point']
    },
    coordinates:{
      type:[Number],
      index:'2dsphere'
    },
    formattedAddress:String,
    country: String,
    city: String,
    state: String,
    zipcode: String,
    streetNumber : String,
    streetName : String

  }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

// geolocation of customer using mongoose middleware
  customerSchema.pre('save',async function(){

  if(this.address){
      const loc = await geocoder.geocode(this.address)
      this.location = {
      type:'Point',
      coordinates:[loc[0].longitude,loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      country: loc[0].country,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      streetNumber : loc[0].streetNumber,
      streetName : loc[0].streetName
     }
  }

 // update user email too
 if(this.email){
  await this.model('User').findOneAndUpdate({customer:this._id},{$set:{email:this.email}},{runValidators:true})
 }
 
})



// cascade remove of user if the customer is deleted in the system as some customer can have user account then their info is link
customerSchema.pre('remove',async function(){
  await this.model('User').deleteMany({customer:this._id})
})



const Customer = mongoose.model('Customer',customerSchema)
module.exports = Customer