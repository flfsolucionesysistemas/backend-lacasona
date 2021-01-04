var express = require('express');
var router = express.Router();
var ctrlGlobal = require('../controllers/global');

//router.get('/getProvincias',ctrlGlobal.getProvincias);
router.get('/getLocalidadesPorProvincia/:idProvincia',ctrlGlobal.getLocalidadesPorProvincia);
router.get('/getProvincias',ctrlGlobal.getProvincias);
router.get('/getIdProvincias/:idLocalidad',ctrlGlobal.getIdProvincia);
router.put('/updateProvincia', ctrlGlobal.updateProvincia);
router.get('/solicitaHC/:idPersona',ctrlGlobal.getLecturaHC);
router.post('/add',ctrlGlobal.addPago);
router.post('/addCupon',ctrlGlobal.addCupon);
router.get('/getCupones/:id_hc_tratamiento', ctrlGlobal.getCuponid_hc_tratamiento);

module.exports = router;
