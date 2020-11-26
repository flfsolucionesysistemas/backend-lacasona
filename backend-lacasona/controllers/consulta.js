const pool = require('../config/database');
var nodemailer = require('nodemailer');
const axios = require('axios');

exports.addConsulta= async (req, res) =>{
    let variable = req.body;
	let costo_en = variable.costo_entrevista;
	let idPersona;
	//EJECUTO EL ALTA DE PERSONA CLIENTE
	let newUser={
			id_tipo_persona: 3,				
			nombre: variable.nombre,
			apellido: variable.apellido,
			email: variable.email,
			telefono: variable.telefono,				
			id_localidad: variable.id_localidad,
			activo:1
	}		
			
	sql=await pool.query('INSERT INTO persona set ?', [newUser])
		if(sql== null){
		
			res.status(400).json({
				error: 'No se ha podido guardar el cliente'
			});
		}
		else{
			let query= sql.insertId;
			console.log(sql.insertId);
			idPersona=query;
			newEntrevista = {
				id_persona: idPersona,				
				fecha_creacion: new Date(),
				costo:costo_en
				};				
			 result=await pool.query('INSERT INTO entrevista set ?', [newEntrevista])
				let idEntrevista = result.insertId;
				if(result != null){
					updateTurno = {
						id_tipo_turno: idEntrevista,
						turno_tratamiento: 0,
						estado: 0,
						observacion:'asignado'
						};
					try {    
						result = await pool.query('UPDATE turno SET ? WHERE id_turno = ?', [updateTurno, variable.id_turno]);
						console.log({result});
						var transporter = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
							user: 'flf.solucionesysistemas@gmail.com',
							pass: 'everLAST2020'
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
					res.status(200).json({
						mensaje:"Turno reservado"
					});
					} catch(err) {
						// If promise is rejected
						console.error(err);
					}
					
				}else{
					return res.status(400).json({
						error:'Error al crear la entrevista'            
					});
				}	
			
		}
	
		}
	