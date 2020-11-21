const pool = require('../config/database');
var nodemailer = require('nodemailer');
const axios = require('axios');

exports.addConsulta= async (req, res) =>{
    let variable = req.body;
	let costo_en = variable.costo_entrevista;
	let idPersona;
	let lala;
	//EJECUTO EL ALTA DE PERSONA CLIENTE
   	axios.post('http://localhost:3000/users/add',{
			id_tipo_persona: 3,				
			nombre: variable.nombre,
			apellido: variable.apellido,
			email: variable.email,
			telefono: variable.telefono,				
			id_localidad: variable.id_localidad,
			activo:1
		})
		.then(async(res)=> {
		if(res.status==200) {
			idPersona=Object.values(res.data);
			newEntrevista = {
				id_persona: idPersona,				
				fecha_creacion: new Date(),
				costo:costo_en
				};				
			await pool.query('INSERT INTO entrevista set ?', [newEntrevista],function(err,sql){
				if(err){
				console.log(err+"error");
				}
				else{
					let id_tipo_turno= sql.insertId;
			   //GENERO UPDATE DE TURNO 
					axios.put('http://localhost:3000/turno/asignarTurno',{
						id_tipo_turno: id_tipo_turno,
						turno_tratamiento: 0,
						id_turno:variable.id_turno
							
					})
					.then(function(res) {
					if(res.status==200) {
						console.log("asignar turno"+Object.values(res.data));
						res.status(200).send({
							 mensaje:'Se asigano el turno'            
						});
						
						}
					})
					.catch(function(err) {
					console.log(err+  "error asiganar turno");
							  
					});
					}
			});
		}
		})
		.catch(function(err) {
			res.status(400).json({
				error:err            
			});
		});
	///
	//OBTENGO LOS DATOS PARA DAR EL ALTA DE ENTREVISTA
	

  /*let idEntrevista = result.insertId;
	if(result != null){
		res.status(200).send({idEntrevista}); 
		updateTurno = {
			id_tipo_turno: idEntrevista,
			turno_tratamiento: 0,
			estado: 0,
			observacion:'asignado'
			};*/
		/*try {    
			result = await pool.query('UPDATE turno SET ? WHERE id_turno = ?', [updateTurno, variable.id_turno]);
			console.log({result});
		} catch(err) {
			// If promise is rejected
			console.error(err);
		}*/
		//Creamos el objeto de transporte para el envio de Email
		/*var transporter = nodemailer.createTransport({
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
	}else{
		return res.status(400).json({
			error:'error al crear la entrevista'            
		});
	}	
    /*if(result != null){
        //res.status(200).send({idPeronsa});       
		let idPersona = result.insertId;
		
		newEntrevista = {
				id_persona: idPersona,				
				fecha_creacion: new Date(),
				costo:costo_en
				};				
		result = await pool.query('INSERT INTO entrevista set ?', [newEntrevista]);
		
		let idEntrevista = result.insertId;
		if(result != null){
			res.status(200).send({idEntrevista}); 
			updateTurno = {
				id_tipo_turno: idEntrevista,
				turno_tratamiento: 0,
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
    }*/

}

