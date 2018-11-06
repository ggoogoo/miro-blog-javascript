const express = require('express');
const router = express.Router();
const nav = require('./nav');
router.use('/', nav);
const login = require('./login');
router.use('/', login);

module.exports = router;
