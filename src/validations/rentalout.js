const Joi = require('@hapi/joi')
async function rentalOutCreateValidation(obj={}){
 const schema = Joi.object({
     customer:Joi.string().min(3).max(1024).required(),
     movie:Joi.string().min(3).max(1024).required(),
     returnDate:Joi.date().greater('now').required()
 })
  try {
    await schema.validateAsync(obj);
    return false
      } catch (error) {
        return error
         }
}




module.exports = {
  rentalOutCreateValidation
}