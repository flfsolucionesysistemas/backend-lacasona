var express = require('express');
var router = express.Router();
var ctrlZoom = require('../controllers/zoom');

router.post('/addMeeting',ctrlZoom.addMeeting);