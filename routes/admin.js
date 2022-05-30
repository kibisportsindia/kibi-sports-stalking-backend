const express = require('express');

const User = require('../models/User');
const Event = require('../models/Event');
const Stake = require('../models/Stake');
const {
  getUsers,
  getUsersStat,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/admin/usersAdmin');
const {
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/admin/eventsAdmin');
const {
  getParticipant,
  getParticipants,
  createParticipant,
  updateParticipant,
  deleteParticipant,
} = require('../controllers/admin/participantsAdmin');
const {
  getStakes,
  getStake,
  createStake,
  updateStake,
  deleteStake,
} = require('../controllers/admin/stakesAdmin');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//Include other resources
userRouter = require('./auth');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorize('admin'));

router.use('/events/:eventId/users', userRouter);

router.route('/users').get(advancedResults(User), getUsers).post(createUser);

router.route('/users/stats').get(getUsersStat);

router.route('/users/:id').get(getUser).put(updateUser).delete(deleteUser);

router
  .route('/events')
  .get(advancedResults(Event), getEvents)
  .post(createEvent);

router.route('/events/:id').get(getEvent).put(updateEvent).delete(deleteEvent);
router.route('/stakes').get(getStakes).post(createStake);

router.route('/stakess/:id').get(getStake).put(updateStake).delete(deleteStake);

router.route('/participants').get(getParticipants).post(createParticipant);

router
  .route('/participants/:id')
  .get(getParticipant)
  .put(updateParticipant)
  .delete(deleteParticipant);

module.exports = router;
