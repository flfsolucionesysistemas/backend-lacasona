var express = require('express');
var router = express.Router();
var ctrlPatologia = require('../controllers/patologia');

router.post('/add',ctrlPatologia.addPatologia);
router.put('/update',ctrlPatologia.updatePatologia);
router.get('/listar',ctrlPatologia.listaPatologia);
router.get('/listarActivos/:valor',ctrlPatologia.listaPatologiaActivos);
module.exports = router;