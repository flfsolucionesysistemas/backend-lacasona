var express = require('express');
var router = express.Router();
var ctrlConsulta = require('../controllers/consulta');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add',ctrlConsulta.addConsulta);
router.post('/registroEntrevista',ctrlConsulta.registroEntrevista);

module.exports = router;
