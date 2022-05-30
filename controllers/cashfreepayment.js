const asyncHandler = require('../middleware/asyncHandler');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

exports.cashfreeToken = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const {
    orderAmount,
    orderNote,
    customerId,
    customerName,
    customerPhone,
    customerEmail,
  } = req.body;
  const orderId = uuidv4();

  //  return_url: `https://sandbox.cashfree.com/pg/orders/order_id=${order_id}&order_token=${order_token}/`,
  //   notify_url: `https://sandbox.cashfree.com/pg/orders/order_id=${order_id}&order_token=${order_token}/`,

  try {
    await axios({
      method: 'post',
      url: 'https://sandbox.cashfree.com/pg/orders',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2022-01-01',
        'x-client-id': '75287a1b4bc3be8a3695eff3c78257',
        'x-client-secret': '87179cf79af53287b3043dc48f82aa5378a025f3',
      },
      data: {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: 'INR',
        order_note: orderNote,
        customer_details: {
          customer_name: customerName,
          customer_id: customerId,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: null,
          notify_url: 'http://localhost:5000/api/v1/cashpayment/paymentstatus',
          payment_methods: null,
        },
      },
    })
      .then((data) => {
        console.log(JSON.stringify(data.data));
        res.status(200).json({ success: true, result: data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

exports.cashfreePaymentStatus = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const order_id = req.body.orderId;
  console.log(order_id);
  try {
    await axios({
      method: 'get',
      url: `https://sandbox.cashfree.com/pg/orders/${order_id}`,
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2022-01-01',
        'x-client-id': '75287a1b4bc3be8a3695eff3c78257',
        'x-client-secret': '87179cf79af53287b3043dc48f82aa5378a025f3',
      },
    }).then((data) => {
      console.log(JSON.stringify(data.data));
      res.status(200).json({ success: true, data: data.data });
    });
  } catch (err) {
    console.log(err);
  }
});

exports.successPurchasedEmail = asyncHandler(async (req, res, next) => {
  try {
    await sendEmail({
      // email: user.email,
      email: 'abc@gmail.com',
      subject: 'Payment Successful',
      html: 'Congrats, You have succesfully purchased this events of worth this rupees',
    });

    res.status(200).json({ success: true, data: 'Email Sent' });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});
exports.failPurchasedEmail = asyncHandler(async (req, res, next) => {
  try {
    await sendEmail({
      email: user.email,
      subject: 'Payment Fail',
      html: 'Sorry, Your payment failed. Please try again.',
    });

    res.status(200).json({ success: true, data: 'Email Sent' });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});
