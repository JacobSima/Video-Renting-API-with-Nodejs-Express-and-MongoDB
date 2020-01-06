
const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'})
const Customer = require('./src/models/Customer')
const Genre = require('./src/models/Genre')
const Movie = require('./src/models/Movie')
const User = require('./src/models/User')
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')

const conn =  async()=>{
    await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex: true
  })

  console.log('DB Connected...')
}

conn()


// Read json files
const customerData =JSON.parse(fs.readFileSync(`${__dirname}/_Data/customer.json`,'utf-8')) 
const genreData =JSON.parse(fs.readFileSync(`${__dirname}/_Data/genre.json`,'utf-8')) 
const movieData =JSON.parse(fs.readFileSync(`${__dirname}/_Data/movie.json`,'utf-8')) 
const userData =JSON.parse(fs.readFileSync(`${__dirname}/_Data/user.json`,'utf-8')) 


const importData = async function(){
 try {
  await Customer.create(customerData)
  await Genre.create(genreData)
  await Movie.create(movieData)
  await User.create(userData)
  console.log('Documents inserted...')
  process.exit()
 } catch (error) {
    console.log(error)
 }
   

 }

const dropData = async()=>{
  try {
  await Customer.deleteMany()
  await Genre.deleteMany()
  await Movie.deleteMany()
  await User.deleteMany()
  console.log('Documents deleted...')
  process.exit()
  } catch (error) {
    console.log(error)
  }
  
}




if(process.argv[2] === '-i'){       // node seeder -i: this i is the process argv[2]
  importData()
}else if (process.argv[2] === '-d'){
  dropData()
}

