var express = require('express');
var router = express.Router();
var ctrlMP = require('../controllers/mercadopago');

router.post('/obtenerurl',ctrlMP.obtenerUrlDePago);
router.post('/notificacion/:nombre/:apellido/:email/:telefono/:id_localidad/:id_turno/:costo_entrevista', ctrlMP.confirmarPago);
router.post('/notificacionTratamiento/:id_hc/:id_cupon', ctrlMP.confirmarPagoTratamiento);
router.post('/obtenerurlTratamiento',ctrlMP.obtenerUrlDePagoTratamiento);
router.get('/getCuponesPaciente/:id_paciente',ctrlMP.getCuponesPacientes);
router.get('/getPagoTipo/:tipo',ctrlMP.getCuponTipo);

module.exports = router;
