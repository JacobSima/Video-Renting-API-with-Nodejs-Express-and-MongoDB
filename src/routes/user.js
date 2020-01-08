const express = require('express')
const router = express.Router()
const {getUser,getUsers,deleteUser,updateUser } = require('../controllers/user')

const {protect,autorize} = require('../middleware/auth')

// include re-use user route
const authRouter = require('./auth')

router.use(protect)
router.use(autorize('admin'))
router.use('/register',authRouter)

router 
  .route('/')
  .get(getUsers)
  

router  
  .route('/:id')
  .get(getUser)
  .delete(deleteUser)
  .put(updateUser)


module.exports = router