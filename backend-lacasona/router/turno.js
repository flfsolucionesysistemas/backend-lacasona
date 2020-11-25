var express = require('express');
var router = express.Router();
var ctrlTurno = require('../controllers/turno');


router.get('/getTurnosDisponiblesTipo/:id_tipo',ctrlTurno.getTurnosDisponiblesTipo);
router.post('/add',ctrlTurno.addTurno);
router.put('/asignarTurno',ctrlTurno.asiganarTurno);
router.put('/update',ctrlTurno.update);
router.get('/getTurnos',ctrlTurno.getTurnos);
router.get('/getTurnosLimit/:limit',ctrlTurno.getTurnosLimit);
router.get('/getTurnosAsignados',ctrlTurno.getTurnosAsignados);

module.exports = router;
