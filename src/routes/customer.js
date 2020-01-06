const express = require('express')
const router = express.Router()
const {getCustomer,getCustomers,createCustomer,updateCustomer,deleteCustomer} = require('../controllers/customers')
const {protect,autorize} = require('../middleware/auth')

router  
  .route('/')
  .get(protect,autorize('staff','admin'),getCustomers)
  .post(protect,autorize('staff','admin'),createCustomer)

router
  .route('/:id')
  .get(protect,autorize('staff','admin'),getCustomer)
  .put(protect,autorize('staff','admin'),updateCustomer)
  .delete(protect,autorize('staff','admin'),deleteCustomer)

module.exports = router