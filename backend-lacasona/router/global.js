var express = require('express');
var router = express.Router();
var ctrlGlobal = require('../controllers/global');

//router.get('/getProvincias',ctrlGlobal.getProvincias);
router.get('/getLocalidadesPorProvincia/:idProvincia',ctrlGlobal.getLocalidadesPorProvincia);
router.get('/getProvincias',ctrlGlobal.getProvincias);
router.get('/getIdProvincias/:idLocalidad',ctrlGlobal.getIdProvincia);
router.put('/updateProvincia', ctrlGlobal.updateProvincia);

module.exports = router;
