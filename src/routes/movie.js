const express = require('express')
const router = express.Router()
const {getMovie,getMovies,createMovie,updateMovie,deleteMovie,uploadPhoto,uploadTriller} = require('../controllers/movie')
const {protect,autorize} = require('../middleware/auth')

router  
  .route('/')
  .get(getMovies)
  .post(protect,autorize('staff','admin'),createMovie)

router
  .route('/:id')
  .get(getMovie)
  .put(protect,autorize('staff','admin'),updateMovie)
  .delete(protect,autorize('staff','admin'),deleteMovie)

router.put('/:id/uploadphoto',uploadPhoto)
router.put('/:id/uploadtriller',uploadTriller)



module.exports = router