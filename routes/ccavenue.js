const express = require('express');
const {
  payment,
  encryptPayment,
  paymentSucess,
  paymentFail,
} = require('../controllers/ccavenue');

const router = express.Router();

// router.get('/live', (req, res) => {
//   res.status(200).send('CCAvenue is live');
// });
router.post('/', payment);
router.get('/encryptpayment', encryptPayment);
router.get('/payment-success', paymentSucess);
router.get('/payment-failure', paymentFail);

module.exports = router;
