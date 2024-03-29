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
router.put('/setFechaContrato', ctrlUsuario.setFechaContrato);
router.delete('/deleteUser/:idUser', ctrlUsuario.deleteUser);
router.get('/getUser/:activos',ctrlUsuario.getUserActivo);
router.get('/getUserTipo/:tipo',ctrlUsuario.getUserTipo);
router.get('/getUserId/:idUser',ctrlUsuario.getUserId);
router.get('/getExisteUser/:email',ctrlUsuario.getExisteUser);
router.get('/olvideClave/:email',ctrlUsuario.olvideClave);
router.put('/updateClave',ctrlUsuario.upadateClave);
router.delete('/borrarUser/:idUser',ctrlUsuario.borrarUser);


module.exports = router;
