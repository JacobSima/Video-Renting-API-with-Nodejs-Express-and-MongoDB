const express = require('express')
const router = express.Router()
const {getRentalOuts,createRentalOut} = require('../controllers/rentalout')
const {protect,autorize} = require('../middleware/auth')


router.get('/',getRentalOuts)
router.post('/out',protect,autorize('admin','staff') ,createRentalOut)

module.exports = router