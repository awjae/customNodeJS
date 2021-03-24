const express = require('express');
const router = express.Router();
const apiController = require('./controller/apiController');

router.get("/hi", apiController.apiTestFunc);

module.exports = router;