const express = require('express')
const router = express.Router()
const {getRentalOuts,createRentalOut,createRentalIn,getRentalIns,getRentalOut,getRentalIn } = require('../controllers/rental')
const {protect,autorize} = require('../middleware/auth')


router.use(protect,autorize('admin','staff'))
router
  .route('/out')
  .get(getRentalOuts)
  .post(createRentalOut)
router
  .route('/out/:id')
  .get(getRentalOut)


router
  .route('/in')
  .get(getRentalIns)
  .post(createRentalIn )
router
  .route('/in/:id')
  .get(getRentalIn)



module.exports = router