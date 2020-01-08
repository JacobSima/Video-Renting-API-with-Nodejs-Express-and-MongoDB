const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const crypto =  require('crypto')

const userSchema = new Schema({
  name:{
    type:String,
    trim:true,
    minlength:3,
    maxlength:1024,
    required:[true,'Please provide customer name']
  },
  email:{
    type:String,
    unique:[true,'email already exists'],
    lowercase:true,
    trim:true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    required:[true,'Please provide an email']
  },
  password:{
    type:String,
    select:false,
    trim:true,
    minlength:3,
    maxlength:1024,
    required:[true,'Please provide password']
  },
  role:{
    type:String,
    enum:['customer','staff','admin'],
    default:'customer'
  },
  customer:{
    type:mongoose.Schema.ObjectId,
    ref:'Customer'
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date

},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

// create static function on the User Schema
userSchema.statics.linkCustomer = async function(email,name){
   const customer = await this.model('Customer').findOne({email}).select('name')
   if(!customer){return }
   return customer._id
}

userSchema.pre('save',async function(){
  
  //hash the password
  if(this.password){
    this.password = await bcrypt.hash(this.password,saltRounds)
  }
  // find user id if he/she is registered as a customer
  const customerId = await this.constructor.linkCustomer(this.email,this.name)
  if(customerId){
     this.customer = customerId
   }

})


// on update hook,ckech if user is linked with customer. then update customer email too
userSchema.methods.updateCustomerEmail = async function(id,email,name){
  //provide customer id
  // provide new email
  await this.model('Customer').findByIdAndUpdate(id,{$set:{email,name}},{runValidators:true})
}



userSchema.methods.signInToken = function(){
  // expired within an hour
return jwt.sign({id:this._id,name:this.name}, process.env.JWT_SECRET, { expiresIn: 60 * 60 })}

userSchema.methods.validateHash = async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.getResetToken = function(){
  // generate resetToken
  // generate random data, with 20 bytes, this need to be formatted as string since we get back a buffer
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash the resetToken ans save it to user.resetPasswordToken
  this.resetPasswordToken = crypto
                              .createHash('sha256')
                              .update(resetToken)
                              .digest('hex')

  // set the expire for 10 min
  this.resetPasswordExpire = Date.now() + 10 +60 + 1000
  
  return resetToken
}

const User = mongoose.model('User',userSchema)
module.exports = User