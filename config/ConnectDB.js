const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async()=>{
  try {
    const connected =  await mongoose.connect('mongodb://localhost:27017/rently',{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify:false,
      useCreateIndex: true
    })
    console.log(`DB connected at ${connected.connections[0].host} port: ${connected.connections[0].port}`.blue)
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = connectDB