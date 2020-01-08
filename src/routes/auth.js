const express = require('express')
const router = express.Router({mergeParams:true})
const {login,getMe,updateDetails,createUser,updatePassword,forgotPassword,resetPassword} = require('../controllers/auth')
const {protect} = require('../middleware/auth')



//routes
router.post('/',createUser)
router.post('/register',createUser)
router.post('/login',login)
router.get('/me',protect,getMe)
router.put('/updatedetails',protect,updateDetails)
router.put('/updatepassword',protect,updatePassword)
router.post('/forgotpassword',forgotPassword)
router.put('/resetpassword/:id',resetPassword)


module.exports = router