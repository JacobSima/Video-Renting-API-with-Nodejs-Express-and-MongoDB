const Joi = require('@hapi/joi')
async function movieCreateValidation(obj={}){
 const schema = Joi.object({
     title:Joi.string().min(3).max(1024).required(),
     genre:Joi.string().min(3).max(1024).required(),
     numberInStock:Joi.number().min(0).max(10000).required(),
     numberOutStock:Joi.number().min(0).max(10000),
     dailyRentalRate:Joi.number().min(0).max(10000).required()
 })
  try {
    await schema.validateAsync(obj);
    return false
      } catch (error) {
        return error
         }
}

async function movieUpdateValidation(obj={}){
  const schema = Joi.object({
    title:Joi.string().min(3).max(1024),
    genre:Joi.string().min(3).max(1024),
    numberInStock:Joi.number().min(0).max(10000),
    numberOutStock:Joi.number().min(0).max(10000),
    dailyRentalRate:Joi.number().min(0).max(10000)
  })
   try {
     await schema.validateAsync(obj);
     return false
       } catch (error) {
         return error
          }
 }


module.exports = {
  movieCreateValidation,
  movieUpdateValidation
}