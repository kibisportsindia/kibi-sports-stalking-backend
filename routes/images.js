const express = require('express');
const router = express.Router();

const { generateImagesUrl } = require('../controllers/images');

const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const url = await generateImagesUrl();
  res.send({ url });
});

module.exports = router;
