const advancedResults = require('../../middleware/advancedResults');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
const Participant = require('../../models/Participant');
const cookieParser = require('cookie-parser');
// const Event = require('../../models/Event');

//Get all users; GET; /admin/users Private/Admin
exports.getParticipants = asyncHandler(async (req, res, next) => {
  const participants = await Participant.find();

  res.status(200).json({ data: participants });
});

//Get Single Partiipant; GET; /admin/participants/:id Private/Admin
exports.getParticipant = asyncHandler(async (req, res, next) => {
  const participant = await Participant.findById(req.params.id);

  res.status(200).json({ data: participant });
});

//Create Participant; POST; /admin/participants Private/Admin
exports.createParticipant = asyncHandler(async (req, res, next) => {
  const {
    individual,
    playerName,
    teamName,
    player1,
    player2,
    gameName,
    description,
    ratings,
    experience,
  } = req.body;
  if (individual === true) {
    const participant = await Participant.create({
      playerName: playerName,
      gameName: gameName,
      description: description,
      ratings: ratings,
      experience: experience,
    });
    res.status(200).json({ data: participant });
  } else {
    const participant = await Participant.create({
      teamName: teamName,
      gameName: gameName,
      players: [{ player1: player1 }, { player2: player2 }],
      description: description,
      ratings: ratings,
      experience: experience,
    });
    res.status(200).json({ data: participant });
  }
});

//Update Participant; PUT; /admin/participants/:id Private/Admin
exports.updateParticipant = asyncHandler(async (req, res, next) => {
  const participant = await Participant.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ data: participant });
});

//Delete Participant; DELETE; /admin/participants/:id; Private/Admin;
exports.deleteParticipant = asyncHandler(async (req, res, next) => {
  await Participant.findByIdAndDelete(req.params.id);

  res.status(200).json({ data: {} });
});
