const Joi = require('@hapi/joi')
async function userUpdateValidation(obj={}){
  const schema = Joi.object({
    name:Joi.string().min(3).max(1024),
    password:Joi.string().min(3).max(1024),
    role:Joi.string().min(1).max(50),
    email:Joi.string().email().min(5).max(1024)
  })
   try {
     await schema.validateAsync(obj);
     return false
       } catch (error) {
         return error
          }
 }


module.exports = {
  userUpdateValidation
}