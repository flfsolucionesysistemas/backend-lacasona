var express = require('express');
var router = express.Router();
var ctrlTratamoento = require('../controllers/tratamiento');

router.post('/add',ctrlTratamoento.add);
module.exports = router;