const express = require('express');

const router = express.Router();


router.use('/auth', require('./auth'));
router.use('/budget', require('./budget'));

module.exports = router;
