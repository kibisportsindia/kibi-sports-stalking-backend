const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ParticipantSchema = new Schema(
  {
    individual: Boolean,
    playerName: {
      type: String,
      // required: [true, 'Please enter the name'],
    },
    teamName: {
      type: String,
      // required: true,
    },
    gameName: String,
    players: [
      {
        player1: {
          type: String,
          // required: true,
        },
        player2: {
          type: String,
          // required : true
        },
      },
    ],
    description: {
      type: String,
    },
    ratings: {
      type: Number,
    },
    experience: {
      type: String,
    },
    // team: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Participant', ParticipantSchema);
