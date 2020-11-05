var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'l4-cas0n4';

exports.createToken = function(usuario){
	var payload = {
        sub : usuario.id,
        tipo_usuario : usuario.id_tipo_usuario,
        localidad : usuario.id_localidad,		
        dni : usuario.dni,
		nombre : usuario.nombre,
        apellido : usuario.apellido,
        usuario : usuario.nombre_usuario,
        clave : usuario.clave_usuario,
        correo : usuario.email,
        telefono : usuario.telefono,        
        estado: usuario.estado,
        activo: usuario.activo,
		iat : moment().unix(), //FECHA DE CREACION DEL TOKEN
		exp : moment().add(30, 'days').unix //FECHA DE EXPIRACION DEL TOKEN
	}

	return jwt.encode(payload, secret);
}