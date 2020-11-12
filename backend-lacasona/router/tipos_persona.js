var express = require('express');
var router = express.Router();
var ctrlTiposPersona = require('../controllers/tipos_persona');

/* GET tipos persona listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//router.post('/addTipo',ctrlTiposPersona.addTipo);
//router.put('/updateTipo', ctrlTiposPersona.updateTipo);
//router.delete('/deleteTipo/:idTipo', ctrlTiposPersona.deleteTipo);
router.get('/getTiposPersona',ctrlTiposPersona.getTiposPersona);

module.exports = router;
