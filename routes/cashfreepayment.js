const express = require('express');
const {
  cashfreeToken,
  cashfreePaymentStatus,
  successPurchasedEmail,
  failPurchasedEmail,
} = require('../controllers/cashfreepayment');

const router = express.Router();

router.post('/', cashfreeToken);
router.post('/paymentstatus', cashfreePaymentStatus);
router.post('/successpaymentemail', successPurchasedEmail);
router.post('/failedpaymentemail', failPurchasedEmail);

module.exports = router;
