const express = require('express');
const bodyParser = require('body-parser');
const NodeCCAvenue = require('node-ccavenue');
const asyncHandler = require('../middleware/asyncHandler');

const app = express();

const ccav = new NodeCCAvenue.Configure({
  merchant_id: process.env.CCAVENUE_MERCHANT_ID,
  working_key: process.env.CCAVENUE_TEST_WORKING_KEY,
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// ?success=true

// const { order_id, amount, billing_name } = req.body;

const orderParams = {
  order_id: 12345,
  currency: 'INR',
  amount: '100',
  redirect_url: encodeURIComponent(`http://localhost:5000/api/v1/payment`),
  billing_name: 'KIBI',
};

// const encryptedOrderData = ccav.getEncryptedOrder(orderParams);
// console.log(encryptedOrderData);

const encryptedOrderData = (order) => {
  return ccav.getEncryptedOrder(order);
};

const decryptedJsonResponse = (encodedData) => {
  const decryptedData = ccav.redirectResponseToJson(encodedData);

  return {
    data: decryptedData,
    responseCode: decryptedData.order_status,
  };
};

exports.encryptPayment = asyncHandler(async (req, res, next) => {
  const { payload } = req.query;
  const data = {
    ...orderParams,
    payload,
  };

  const encryptedData = encryptedOrderData(data);
  console.log(encryptedData);

  if (encryptedData) {
    res.status(200).json({
      data: encryptedData,
      status: 'SUCCESS',
    });
  } else {
    res.status(400).json({
      data: null,
      status: 'FAILURE',
    });
  }
});

exports.payment = asyncHandler(async (req, res, next) => {
  const { encResponse } = req.body;
  const paymentStatus = decryptedJsonResponse(encResponse).responseCode;

  if (paymentStatus === 'Success') {
    res.redirect('/api/v1/payment/payment-sucess');
  } else {
    res.redirect('/api/v1/payment/payment-failure');
  }
});

exports.paymentSucess = asyncHandler(async (req, res, next) => {
  res.status(200).json('Payment Successful');
});
exports.paymentFail = asyncHandler(async (req, res, next) => {
  res.status(200).json('Sorry, Payment Fail');
});
