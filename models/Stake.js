const mongoose = require('mongoose');

const StakeSchema = new mongoose.Schema({
  transactionId: {
    required: true,
    type: Number,
  },
  amount: {
    type: Number,
    // required: true,
  },
  // player: {
  //   type: String,
  //   required: true,
  // },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    // required:'true'
  },

  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    // required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
});

//Static method to get progress of fulled pool
StakeSchema.statics.getFilledPool = async function (eventId) {
  console.log('Progress Bar'.blue);

  const obj = await this.aggregate([
    {
      $match: { event: eventId },
    },
    {
      $group: {
        _id: '$team',
        filledPool: { $sum: '$amount' },
      },
    },
  ]);
  console.log(obj);

  try {
    await this.model('Event').findByIdAndUpdate(eventId, {
      filledPool: obj,
    });
  } catch (err) {}
};

// Call getFilledPool after save
StakeSchema.post('save', function () {
  this.constructor.getFilledPool(this.event);
});

//getFiledPool after remove
StakeSchema.pre('remove', function () {
  this.constructor.getFilledPool(this.event);
});

module.exports = mongoose.model('Stake', StakeSchema);
