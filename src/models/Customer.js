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
    minlength:2,
    maxlength:1024
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
    minlength:10,
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
})

// geolocation of customer using mongoose middleware
customerSchema.pre('save',async function(){
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
 // set address to undefined since we have already the fomatted address 
 this.address = undefined
})



const Customer = mongoose.model('Customer',customerSchema)
module.exports = Customer