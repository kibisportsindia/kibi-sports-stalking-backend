const Event = require('../models/Event');
const asyncHandler = require('../middleware/asyncHandler');

exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find().populate([
    {
      path: 'opponent1',
      select: 'playerName',
    },
    {
      path: 'opponent2',
      select: 'playerName',
    },
  ]);

  res.status(200).json({ success: true, count: events.length, data: events });
});

exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  res.status(200).json({ success: true, data: event });
});
