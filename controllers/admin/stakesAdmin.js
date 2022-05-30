const advancedResults = require('../../middleware/advancedResults');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const User = require('../../models/User');
const Stake = require('../../models/Stake');

//Get All Events; GET; /admin/events,/admin/user/:userId/events; Private/Admin
exports.getStakes = asyncHandler(async (req, res, next) => {
  const stakes = await Stake.find()
    .populate({ path: 'user', select: 'name' })
    .populate({ path: 'event', select: 'game' });
  // let query;
  // if (req.params.userId) {
  //   query = Event.find({ user: req.params.userId });
  // } else {
  //   query = Event.find();
  // }

  // const events = await query;
  // res.status(200).json({ sucess: true, count: events.length, data: events });
  res.status(200).json({ success: true, data: stakes, count: stakes.length });
});

//Get One Event; GET; /admin/events/:id; Private/Admin
exports.getStake = asyncHandler(async (req, res, next) => {
  const stake = await Stake.findById(req.params.id);

  res.status(200).json({ success: true, data: stake });
});

//Create Event; POST; /admin/events
exports.createStake = asyncHandler(async (req, res, next) => {
  const stake = await Stake.create(req.body);

  res.status(201).json({ success: true, data: stake });
});

//Update Event; PUT; /admin/events/:id; Private/Admin
exports.updateStake = asyncHandler(async (req, res, next) => {
  const stake = await Stake.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: stake });
});

//Delete Event; Delete; /admin/events/:id; Private/Admin
exports.deleteStake = asyncHandler(async (req, res, next) => {
  await Event.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
