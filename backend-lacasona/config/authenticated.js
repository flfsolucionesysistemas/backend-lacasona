var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'l4-cas0n4';

exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({message:'La peticion no tiene cabecera de autenticacion'});
	}

	//QUITA LOS ' Y "
	var token = req.headers.authorization.replace(/['"]+/g, '');

	try{
		var payload = jwt.decode(token, secret); //DECODIFICA LA CLAVE

		//COMPARA LA FECHA DE EXPIRACION Y LA FECHA DEL MOMENTO DE PETICION, AHORA
		if(payload.exp <= moment().unix()){
			return res.status(401).send({message: 'El token ha expirado.'});			
		}
	}catch(ex){		
		return res.status(404).send({message : 'Token no válido.'});
	}

	//TODO ES OK
	req.usuario = payload;

	//SALE DEL MEDDLEWARE
	next();
};