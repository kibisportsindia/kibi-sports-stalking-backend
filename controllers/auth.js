const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

//Register User; POST; /auth/register; Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const Email = await User.findOne({ email: req.body.email });

  if (Email) {
    return next(new ErrorResponse('User Already Exist', 404));
  }

  //Create User

  const user = await User.create({
    name,
    email,
    password,
  });

  //Create token

  sendTokenResponse(user, 201, res);
});
//Login User; POST; /auth/login; Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password'));
  }

  //Check for user; Left side is key from schema and right side is coming from req.body
  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  //Password match
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

//getMe, GET, auth/me, Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//Update user details; PUT; /auth/updatedetails; Private;
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
  };

  const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  // res.status(200).json({ success: true, data: user });
  sendTokenResponse(user, 200, res);
});

//Update Password; PUT; /auth/updatepassword; Private;
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  //Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorResponse('Confirm Password is not same', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//Forget Password; POST; /auth/forgotpassword; Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('No user found with this email', 404));
  }

  //Get Reset Token
  const resetToken = user.getResetPasswordToken();

  console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  //Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/auth/resetpassword/${resetToken}`;

  const message = `You have requested the reset the password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Please reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email Sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }

  res.status(200).json({ success: true, data: user });
});

//Reset Password; PUT; /auth/resetpassword/:resettoken; Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update('req.params.resettoken')
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  //Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//getMe, GET, auth/me, Private
exports.profileImg = asyncHandler(async (req, res, next) => {
  // const user = await User.findById(req.user.id);
  // const fieldsToUpdate = {
  //   profileImg: req.file.filename,
  // };

  const fieldsToUpdate = {
    profileImg: req.file.filename,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  // res.status(200).json({ success: true, data: user });
  sendTokenResponse(user, 200, res);
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token, user });
};
