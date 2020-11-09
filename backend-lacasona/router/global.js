var express = require('express');
var router = express.Router();
var ctrlGlobal = require('../controllers/global');

//router.get('/getProvincias',ctrlGlobal.getProvincias);
router.get('/getLocalidadesPorProvincia/:idProvincia',ctrlGlobal.getLocalidadesPorProvincia);
router.get('/getProvincias',ctrlGlobal.getProvincias);

module.exports = router;
