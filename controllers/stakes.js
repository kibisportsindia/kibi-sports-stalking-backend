const Event = require('../models/Event');
const Stake = require('../models/Stake');
const User = require('../models/User');
const ErrorResponse = require('../middleware/error');
const asyncHandler = require('../middleware/asyncHandler');

exports.getStakes = asyncHandler(async (req, res, next) => {
  const stakes = await Stake.find()
    // .populate({
    //   path: 'event',
    //   select: 'game poolAmount',

    //   // populate: {
    //   //   path: 'opponent1 opponent2',
    //   //   modal: 'event',
    //   // },
    // })
    .populate([
      { path: 'event', select: 'game poolAmount' },
      {
        path: 'opponent',
        select: 'playerName',
      },
    ]);

  // const stakes = await Stake.find().populate('event');

  res.status(200).json({ success: true, data: stakes });
});

exports.getStake = asyncHandler(async (req, res, next) => {
  const stake = await Stake.findById(req.params.id);

  res.status(200).json({ success: true, data: stake });
});

exports.buyStake = asyncHandler(async (req, res, next) => {
  // const { event } = req.body.id;

  const stake = await Stake.create(req.body);

  res.status(201).json({ success: true, data: stake });
});

// exports.buyStake = asyncHandler(async (req, res, next) => {
//   const { amount1, amount2 } = req.body;
//   console.log(amount1, amount2);

//   const eventId = req.params.id;
//   console.log(eventId);

//   const event = await Event.findOne({ eventId: eventId });

//   // if (!event) {
//   //   return next(new ErrorResponse('You have already bought the stake', 401));
//   // }

//   res.status(200).json({ success: true, message: 'You bought successfully' });
// });
