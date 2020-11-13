var express = require('express');
var router = express.Router();
var ctrlTurno = require('../controllers/turno');


router.get('/getTrunosEntrevista',ctrlTurno.getTrunosEntrevista);
router.post('/add',ctrlTurno.addTurno);

module.exports = router;
