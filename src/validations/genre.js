const Joi = require('@hapi/joi')
async function genreCreateValidation(obj={}){
 const schema = Joi.object({
     name:Joi.string().min(4).max(255).required(),
     description:Joi.string().min(5).max(1024).required(),
 })
  try {
    await schema.validateAsync(obj);
    return false
      } catch (error) {
        return error
         }
}

async function genreUpdateValidation(obj={}){
  const schema = Joi.object({
      name:Joi.string().min(4).max(255),
      description:Joi.string().min(5).max(1024),
  })
   try {
     await schema.validateAsync(obj);
     return false
       } catch (error) {
         return error
          }
 }


module.exports = {
  genreCreateValidation,
  genreUpdateValidation
}