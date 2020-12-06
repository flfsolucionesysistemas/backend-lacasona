var express = require('express');
var router = express.Router();
var ctrlHC = require('../controllers/historia_clinica');

router.post('/addHC',ctrlHC.addHC);
router.post('/addHCTratamiento',ctrlHC.addHCTratamiento);
router.put('/updateHCTratamiento',ctrlHC.updateHCTra);
router.post('/addEvolucion',ctrlHC.addEvolucion);

module.exports = router;