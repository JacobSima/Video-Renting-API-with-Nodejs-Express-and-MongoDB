const express = require('express')
const router = express.Router({mergeParams:true})
const {getUser,getUsers,createUser,deleteUser,updateUser } = require('../controllers/user')

const {protect,autorize} = require('../middleware/auth')

router.route('/').post(createUser)

router.use(protect)
router.use(autorize('admin'))

router 
  .route('/')
  .get(getUsers)
  

router  
  .route('/:id')
  .get(getUser)
  .delete(deleteUser)
  .put(updateUser)


module.exports = router