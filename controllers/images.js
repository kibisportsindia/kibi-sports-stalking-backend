const aws = require('aws-sdk');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const { promisify } = require('util');
const randomBytes = promisify(crypto.randomBytes);

const region = 'ap-south-1';
// const bucketName = process.env.AWS_BUCKET_NAME;
const bucketName = 'kibi-sports-profile-image';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// aws.config.getCredentials(function (err) {
//   if (err) console.log(err.stack);
//   // credentials not loaded
//   else {
//     console.log('Access key:', aws.config.credentials.accessKeyId);
//   }
// });

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  // signatureVersion: 'v4',
});

exports.generateImagesUrl = asyncHandler(async (req, res, next) => {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex');

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const imageURL = await s3.getSignedUrlPromise('putObject', params);
  return imageURL;

  // if (!imageUrl) {
  //   next(new ErrorResponse('File not uploaded', 505));
  // }

  // const url = s3.uploadImagesUrl();

  // res.json({ success: true, url });
});
