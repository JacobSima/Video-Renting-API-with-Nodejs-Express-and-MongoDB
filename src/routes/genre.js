const express = require('express')
const router = express.Router()
const {getGenre,getGenres,createGenre,updateGenre,deleteGenre} = require('../controllers/genre')

const {protect,autorize} = require('../middleware/auth')

router
  .route('/')
  .get(getGenres)
  .post(protect,autorize('staff','admin'),createGenre)

router 
  .route('/:id')
  .get(getGenre)
  .put(protect,autorize('staff','admin'),updateGenre)
  .delete(protect,autorize('staff','admin'),deleteGenre)



module.exports = router