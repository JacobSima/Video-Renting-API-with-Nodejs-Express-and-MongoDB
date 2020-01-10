const Joi = require('@hapi/joi')
async function rentalOutCreateValidation(obj={}){
 const schema = Joi.object({
     customer:Joi.string().min(3).max(1024).required(),
     movie:Joi.string().min(3).max(1024).required(),
     returnDate:Joi.date().required(),
     dateOut:Joi.date().required()
 })
  try {
    await schema.validateAsync(obj);
    return false
      } catch (error) {
        return error
         }
}

async function rentalInCreateValidation(obj={}){
  const schema = Joi.object({
      rentalOut:Joi.string().min(3).max(1024).required(),
      dateIn:Joi.date()
      
  })
   try {
     await schema.validateAsync(obj);
     return false
       } catch (error) {
         return error
          }
 }




module.exports = {
  rentalOutCreateValidation,
  rentalInCreateValidation,
}