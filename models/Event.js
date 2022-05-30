const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    league: String,
    game: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    poolAmount: {
      type: Number,
      required: true,
    },
    filledPool: {
      type: Array,
    },
    markUp: {
      type: Number,
      required: true,
    },
    eventDate: {
      type: Date,
      // required: true,
    },
    eventTime: {
      // type: Date,
      // required: true,
    },
    venue: {
      type: String,
      // required : true,
    },
    opponent1: {
      type: Schema.ObjectId,
      ref: 'Participant',
    },
    opponent2: {
      type: Schema.ObjectId,
      ref: 'Participant',
    },
    buy: {
      type: Schema.ObjectId,
      ref: 'Buy',
    },

    // amount1: {
    //   type: Number,

    //   match: [/^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/, 'Please enter valid amount'],
    // },
    // amount2: {
    //   type: Number,

    //   match: [/^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/, 'Please enter valid amount'],
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
