const express = require('express');
const { buyStake, getStake, getStakes } = require('../controllers/stakes');

const router = express.Router();

router.get('/', getStakes);
router.get('/:id', getStake);
router.post('/', buyStake);

module.exports = router;
