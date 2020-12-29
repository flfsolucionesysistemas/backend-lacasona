var express = require('express');
var router = express.Router();
var ctrlMP = require('../controllers/mercadopago');

router.post('/obtenerurl',ctrlMP.obtenerUrlDePago);
router.post('//notificacion/:idDelUsuario', ctrlMP.confirmarPago);

module.exports = router;
