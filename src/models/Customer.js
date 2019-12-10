const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
  }

})


const Customer = mongoose.model('Customer',customerSchema)
module.exports = Customer