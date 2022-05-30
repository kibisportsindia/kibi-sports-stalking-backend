const advancedResults = require('../../middleware/advancedResults');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const User = require('../../models/User');
const Event = require('../../models/Event');

//Get All Events; GET; /admin/events,/admin/user/:userId/events; Private/Admin
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find().populate({
    path: 'participant',
    select: 'playerName',
  });
  // let query;
  // if (req.params.userId) {
  //   query = Event.find({ user: req.params.userId });
  // } else {
  //   query = Event.find();
  // }

  // const events = await query;
  // res.status(200).json({ sucess: true, count: events.length, data: events });
  res.status(200).json({ success: true, data: events });
});

//Get One Event; GET; /admin/events/:id; Private/Admin
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  res.status(200).json({ success: true, data: event });
});

//Create Event; POST; /admin/events
exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);

  res.status(201).json({ success: true, data: event });
});

//Update Event; PUT; /admin/events/:id; Private/Admin
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: event });
});

//Delete Event; Delete; /admin/events/:id; Private/Admin
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  await Event.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
