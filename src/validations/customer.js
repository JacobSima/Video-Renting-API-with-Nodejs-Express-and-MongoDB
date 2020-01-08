const Joi = require('@hapi/joi')
async function customerCreateValidation(obj={}){
 const schema = Joi.object({
     name:Joi.string().min(3).max(1024).required(),
     phone:Joi.string().min(3).max(1024).required(),
     address:Joi.string().min(10).max(1024).required(),
     membership:Joi.string().min(1).max(50),
     email:Joi.string().email().min(5).max(1024).required()
 })
  try {
    await schema.validateAsync(obj);
    return false
      } catch (error) {
        return error
         }
}

async function customerUpdateValidation(obj={}){
  const schema = Joi.object({
     name:Joi.string().min(3).max(1024),
     phone:Joi.string().min(3).max(1024),
     address:Joi.string().min(10).max(1024),
     membership:Joi.string().min(1).max(50),
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
  customerCreateValidation,
  customerUpdateValidation
}