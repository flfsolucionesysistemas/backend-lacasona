var express = require('express');
var router = express.Router();
var ctrlHC = require('../controllers/historia_clinica');

router.post('/addHC',ctrlHC.addHC);
router.post('/addHCTratamiento',ctrlHC.addHCTratamiento);
router.get('/getHCTratamientoPorHC/:idHC',ctrlHC.getHCTratamientoPorHC);
router.put('/updateHCTratamiento',ctrlHC.updateHCTra);
router.get('/getHCPorPersona/:idPersona',ctrlHC.getHCPorPersona);
router.post('/addEvolucion',ctrlHC.addEvolucion);
router.get('/getHCTratamientoSinFechaAlta/:idPaciente',ctrlHC.getHCTratamientoSinFechaAlta);

module.exports = router;