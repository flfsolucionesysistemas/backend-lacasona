var express = require('express');
var router = express.Router();
var ctrlHC = require('../controllers/historia_clinica');

router.post('/addHC',ctrlHC.addHC);
router.post('/addHCTratamiento',ctrlHC.addHCTratamiento);
router.get('/getHCTratamientoPorHC/:idHC',ctrlHC.getHCTratamientoPorHC);
router.put('/updateHCTratamiento',ctrlHC.updateHCTra);
router.get('/getHCPorPersona/:idPersona',ctrlHC.getHCPorPersona);
router.post('/addEvolucion',ctrlHC.addEvolucion);
router.get('/getHCTratamientoSinFechaAlta',ctrlHC.getHCTratamientoSinFechaAlta);
router.get('/getHC/:idHC',ctrlHC.getHC);
router.get('/getHCTratamiento/:id',ctrlHC.getHCTratamientoId);
router.get('/leerHC/:id',ctrlHC.leerhc);
router.put('/updateEvolucion',ctrlHC.updateEvolucion);

module.exports = router;