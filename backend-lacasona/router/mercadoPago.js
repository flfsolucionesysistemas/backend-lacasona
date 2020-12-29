var express = require('express');
var router = express.Router();
var ctrlMP = require('../controllers/mercadopago');

router.post('/obtenerurl',ctrlMP.obtenerUrlDePago);
router.post('/notificacion/:nombre/:apellido/:email/:telefono/:localidadSleccionada/:turnoSeleccionado/:costo_entrevista', ctrlMP.confirmarPago);

module.exports = router;
