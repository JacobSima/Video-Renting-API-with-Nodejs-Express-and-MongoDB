const express = require('express')
const router = express.Router()
const {getMovie,getMovies,createMovie,updateMovie,deleteMovie} = require('../controllers/movie')

router  
  .route('/')
  .get(getMovies)
  .post(createMovie)

router
  .route('/:id')
  .get(getMovie)
  .put(updateMovie)
  .delete(deleteMovie)



module.exports = router