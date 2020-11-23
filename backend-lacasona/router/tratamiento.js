var express = require('express');
var router = express.Router();
var ctrlTratamiento = require('../controllers/tratamiento');

router.post('/add',ctrlTratamiento.add);
module.exports = router;