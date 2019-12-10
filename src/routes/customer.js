const express = require('express')
const router = express.Router()
const {getCustomer,getCustomers,createCustomer,updateCustomer,deleteCustomer} = require('../controllers/customers')

router  
  .route('/')
  .get(getCustomers)
  .post(createCustomer)

router
  .route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer)

module.exports = router