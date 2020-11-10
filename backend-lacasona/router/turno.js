var express = require('express');
var router = express.Router();
var ctrlTurno = require('../controllers/turno');


router.get('/getTrunosEntrevista',ctrlTurno.getTrunosEntrevista);

module.exports = router;
