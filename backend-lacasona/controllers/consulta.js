const pool = require('../config/database');
const jwt = require('../config/jwt');
const helpers = require('../config/helpers');
var nodemailer = require('nodemailer');

exports.addConsulta= async (req, res) =>{
    let variable = req.body;
	    
    let result;
    let newUser = {};
    newUser = {
				id_tipo_persona: 3,				
				nombre: variable.nombre,
				apellido: variable.apellido,
				email: variable.email,
				telefono: variable.telefono,				
				id_localidad: variable.id_localidad,
				activo:1
				};				
	result = await pool.query('INSERT INTO persona set ?', [newUser]);
		
    if(result != null){
        //res.status(200).send({idPeronsa});       
		let idPersona = result.insertId;
		
		newEntrevista = {
				id_persona: idPersona,				
				fecha_creacion: '2020-11-11',
				costo:1000
				};				
		result = await pool.query('INSERT INTO entrevista set ?', [newEntrevista]);
		
		let idEntrevista = result.insertId;
		if(result != null){
			res.status(200).send({idEntrevista}); 
			updateTurno = {
				id_tipo_turno: idEntrevista,
				tipo_turno: 'entrevista',
				estado: 0,
				observacion:'asignado'
				};
			try {    
				result = await pool.query('UPDATE turno SET ? WHERE id_turno = ?', [updateTurno, variable.id_turno]);
				console.log({result});
			} catch(err) {
				// If promise is rejected
				console.error(err);
			}
			//Creamos el objeto de transporte para el envio de Email
			var transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
				user: 'analia.f93@gmail.com',
				pass: '22demayo'
				}
			});
			var email="Bienvenido a 'la casona web'. Nos comunicamos con Ud. pro que ha solicitado su primer consulta";
			var mailOptions = {
				from: 'LaCasonaWeb',
				to: variable.email,
				subject: 'Consulta la casona web',
				text: email
			};
			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
				console.log(error);
				} else {
				console.log('Email enviado: ' + info.response);
				}
			});
		}else{
			return res.status(400).json({
				error:'error al crear la entrevista'            
			});
		}
    }
    else{
        return res.status(400).json({
            error:'Error al cargar persona'            
        }); 
    }

}

