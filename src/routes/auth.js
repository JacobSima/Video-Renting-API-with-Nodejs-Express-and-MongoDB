const express = require('express')
const router = express.Router()
const {login,getMe} = require('../controllers/auth')
const {protect} = require('../middleware/auth')

// include re-use user route
const userRouter = require('./user')
router.use('/register',userRouter)
router.route('/login').post(login)
router.route('/me').get(protect,getMe)


module.exports = router