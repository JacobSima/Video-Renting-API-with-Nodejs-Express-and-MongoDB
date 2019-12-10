
const server = function(){
  const express =  require('express')
  const morgan = require('morgan')
  const error = require('./middleware/error')

  // config .env
  const dotenv =  require('dotenv')
  dotenv.config({path:'./config/config.env'})

  // load routes
  const genres = require('./routes/genre')
  const movies = require('./routes/movie')
  const customers = require('./routes/customer')
  

  // Connect to DB
  require('../config/ConnectDB')()

  const app = express()

  // Middlewares
  // morgan for development
  if(process.env.NODE_ENV = 'development'){
    app.use(morgan('dev'))
  }
  // expressjson
  app.use(express.json())
 


  // Use Routes
  app.use('/api/v1/genres',genres)
  app.use('/api/v1/movies',movies)
  app.use('/api/v1/customers',customers)


  // Express Error Middleware
  app.use(error)

  const PORT = process.env.PORT || 4001
  app.listen(PORT,console.log(`Server started on Port: ${PORT}`.cyan))
  
  // Exit the program in case of uncaughtException or unhandledRejection
  process.on('uncaughtException',(reason,promise)=>{
    console.log(`process fail due to uncaughtException of  ${reason.message}`.red)
     process.exit(1)
  })

  process.on('unhandledRejection',(reason,promise)=>{
    console.log(`process fail due to unhandledRejection of  ${reason.message}`.red)
    process.exit(1)
  })

}
module.exports = server














