const express = require('express')
const router = express.Router()
const {getGenre,getGenres,createGenre,updateGenre,deleteGenre} = require('../controllers/genre')

router
  .route('/')
  .get(getGenres)
  .post(createGenre)

router 
  .route('/:id')
  .get(getGenre)
  .put(updateGenre)
  .delete(deleteGenre)



module.exports = router