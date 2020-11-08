var express = require('express');
var router = express.Router();
var ctrlUsuario = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add',ctrlUsuario.useradd);
router.post('/login', ctrlUsuario.loginUser);
router.put('/updateUser', ctrlUsuario.updateUser);
router.delete('/deleteUser/:idUser', ctrlUsuario.deleteUser);
router.get('/getUser/:activos',ctrlUsuario.getUserActivo);

module.exports = router;
