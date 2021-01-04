var express = require('express');
var router = express.Router();
var ctrlTratamiento = require('../controllers/tratamiento');

router.post('/add',ctrlTratamiento.add);
router.put('/update',ctrlTratamiento.updateTratamiento);
router.get('/listar',ctrlTratamiento.listaTratamientos);
router.get('/getTratamientoId/:id_tratamiento',ctrlTratamiento.getTratamientoId);
router.get('/listarActivos/:valor',ctrlTratamiento.listaTratamientosActivos);
router.get('/tratamientoIdPaciente/:idPaciente',ctrlTratamiento.getTratamientoIdPaciente);
router.get('/tratamientoIdPacienteConInfoTratamiento/:idPaciente',ctrlTratamiento.getTratamientoIdPacienteConInfoTratamiento);
router.get('/getTimeline/:idPaciente',ctrlTratamiento.getEvolucionFase);
router.get('/getFaseActual/:idPaciente',ctrlTratamiento.getEvolucionFaseActual);

module.exports = router;
