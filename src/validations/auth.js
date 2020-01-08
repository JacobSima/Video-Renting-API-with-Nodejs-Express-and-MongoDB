const Joi = require('@hapi/joi')
async function authCreateValidation(obj={}){
 const schema = Joi.object({
  name:Joi.string().min(3).max(1024).required(),
  password:Joi.string().min(3).max(1024).required(),
  email:Joi.string().email().min(5).max(1024).required()
 })
  try {
    await schema.validateAsync(obj);
    return false
      } catch (error) {
        return error
         }
}


async function loginValidation(obj={}){
  const schema = Joi.object({
   password:Joi.string().min(3).max(1024).required(),
   email:Joi.string().email().min(5).max(1024).required()
  })
   try {
     await schema.validateAsync(obj);
     return false
       } catch (error) {
         return error
          }
 }



async function authUpdateDetails(obj={}){
  const schema = Joi.object({
    name:Joi.string().min(3).max(1024),
    email:Joi.string().email().min(5).max(1024)
  })
   try {
     await schema.validateAsync(obj);
     return false
       } catch (error) {
         return error
          }
 }


 async function authUpdatePassword(obj={}){
  const schema = Joi.object({
    oldPassword:Joi.string().min(3).max(1024).required(),
    newPassword:Joi.string().min(3).max(1024).required()
  })
   try {
     await schema.validateAsync(obj);
     return false
       } catch (error) {
         return error
          }
 }



 async function forgotPassword(obj={}){
  const schema = Joi.object({
    email:Joi.string().email().min(5).max(1024)
  })
   try {
     await schema.validateAsync(obj);
     return false
       } catch (error) {
         return error
          }
 }


 async function resetPassword(obj={}){
  const schema = Joi.object({
    password:Joi.string().min(3).max(1024).required()
  })
   try {
     await schema.validateAsync(obj);
     return false
       } catch (error) {
         return error
          }
 }



module.exports = {
  authCreateValidation,
  authUpdateDetails,
  loginValidation,
  authUpdatePassword,
  forgotPassword,
  resetPassword
}