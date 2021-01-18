const pool = require('../config/database');
var nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs');
const PDFDocument = require('pdfkit');
let administradores=[];
let emailProfesional;
var meses = [
	"Enero", "Febrero", "Marzo",
	"Abril", "Mayo", "Junio", "Julio",
	"Agosto", "Septiembre", "Octubre",
	"Noviembre", "Diciembre"
  ]

exports.addConsulta= async (req, res) =>{
	axios.get('http://localhost:3000/users/getUserTipo/1').then(resul=>
	administradores=resul.data);
					
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
				status:400,
				mensaje: 'No se ha podido guardar datos de la persona'
			});
		}
		else{
			let query= sql.insertId;
			console.log(sql.insertId);
			idPersona=query;
			newEntrevista = {
				id_persona: idPersona,				
				fecha_creacion: new Date(),
				costo:costo_en,
				id_pago:variable.id_pago
				};	
			//Add de entrevista	
			 result = await pool.query('INSERT INTO entrevista set ?', [newEntrevista])
				let idEntrevista = result.insertId;
				if(result != null){
					updateTurno = {
						id_tipo_turno: idEntrevista,
						turno_tratamiento: 0,
						estado: 0,
						observacion:'asignado'
						};
					//SE ASIGNA EL TURNO	  
						result = await pool.query('UPDATE turno SET ? WHERE id_turno = ?', [updateTurno, variable.id_turno]);
						console.log(result);
					//SE ENVIAN LOS CORREOS ELECTRONICOS	
						const turnoasignado = await axios({
							url: 'http://localhost:3000/turno/getTurnoId/'+variable.id_turno,
							method: 'get'
						});
						let mes =(new Date (turnoasignado.data[0].fecha)).getMonth();
						let fecha=(new Date (turnoasignado.data[0].fecha)).getDate()+'-'+meses[mes] +'-'+(new Date (turnoasignado.data[0].fecha)).getFullYear();
						console.log(fecha);
					 
						var transporter = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
							user: 'flf.solucionesysistemas@gmail.com',
							pass: 'everLAST2020'
							}
						});
						var meet="https://meet.jit.si/lacasonameet"+variable.email;
						var emailCliente="Bienvenido a PSICOINTERACCION."+
										" Nos comunicamos con Ud. por que ha solicitado su primer entrevista. "+
										 "Fecha: "+fecha+".  Hora: "+turnoasignado.data[0].hora+
										 "El link para acceder a la consulta es el siguiente:  "+ meet;
						var emailAdmin="Se acaba de registrar una nueva solicitud de consulta via web"
						//sumar el meet de la reunion
						var mailOptionsCliente = {
							from: 'LaCasonaWeb',
							to: variable.email,
							subject: 'Consulta la casona web',
							text: emailCliente
						};
						
						transporter.sendMail(mailOptionsCliente, function(error, info){
							if (error) {
							console.log(error);
							} else {
							console.log('Email enviado: ' + info.response);
							}
						});
						for(var i=0; i<administradores.length; i++){
							//console.log(administradores[i].email);
							var mailOptionsAdmin = {
								from: 'LaCasonaWeb',
								to: administradores[i].email,
								subject: 'Entrevista la casona web',
								text: emailAdmin
							};
							transporter.sendMail(mailOptionsAdmin, function(error, info){
								if (error) {
								console.log(error);
								} else {
								console.log('Email enviado: ' + info.response);
								}
							});
						}
					res.status(200).json({
						status:200,
						mensaje:"Su turno se asigno correctamente, recibirá un correo electronico"
					});
					
				}else{
					return res.status(400).json({
						status:400,
						mensaje:'No se ha podido asignar el turno'            
					});
				}	
			
		}
	
		}


exports.registroEntrevista = async (req, res) =>{
	let datos = req.body;
	let ramdon= Math.random();
	
	axios.put('http://localhost:3000/users/updateUser',{
		"id_persona": datos.id_cliente,
		"obra_social": datos.obra_social,
		"numero_afiliado": datos.numero_afiliado,
		"fecha_nacimiento": datos.fecha_nacimiento		
	})
	.then(function(res) {
	  if(res.status==200 ) {
		console.log("OK");
	  }
	})
	.catch(function(err) {
	  console.log(err);
	});
	axios.get('http://localhost:3000/users/getUserId/'+datos.id_profesional)
	.then(function(resul){
		emailProfesional=resul.data[0].email
		console.log(emailProfesional);
		var pdf = new PDFDocument({
			size: 'LEGAL', // See other page sizes here: https://github.com/devongovett/pdfkit/blob/d95b826475dd325fb29ef007a9c1bf7a527e9808/lib/page.coffee#L69
			info: {
			  Title: 'Tile of File Here',
			  Author: 'Some Author',
			}
		  });
		  pdf.fontSize(20)
			   .text('Formulario de registración de entrevista', 100, 100)
			   .text('');
		  pdf.fontSize(18)
			   .text('Admitido: '+datos.admitido, 100, 100)
			   .text('');
		  pdf.fontSize(11)
			   .text('Fecha: '+datos.fecha+'-  Tipo de consulta: '+datos.tipo_consulta)
			   .text('Obra social: '+datos.obra_social+'-  N° de afiliado: '+datos.numero_afiliado )
			   .text('Fecha de nacimiento: '+datos.fecha_nacimiento+'-  Domicilio: '+datos.domicilio+ '- Telefono: '+datos.telefono )
			   .text('Edad: '+datos.edad+'-  Estado civil: '+datos.estado_civil+ '- D.N.I: '+datos.numero_documento+' -  Ocupación:'+datos.ocupacion );
		 pdf.fontSize(20)
			   .text('CGIP: '+datos.cgip)
			   .text('');	  
		 pdf.fontSize(11)
			   .text('Motivo: '+datos.motivo+'-  Derivado por: '+datos.derivado_por)
			   .text('Padecimiento: '+datos.padecimiento+'-  antecedentes: '+datos.antecedentes)
			   .text('Diagnostico: '+datos.diagnostico+'-  Tratamiento: '+datos.tratamiento+'-  Farmacologia: '+datos.farmacologia );
		 
		  /*pdf.addPage()
			   .fontSize(12)
			   .text('Fecha: '+datos.fecha+'  Tipo de consulta: '+datos.tipo_consulta+ ' Telefono: '+datos.telefono );*/
		  pdf.pipe(
			fs.createWriteStream('./registro_entrevista/registro_entrevista_'+datos.id_cliente+ramdon+'.pdf')
		  )
		  .on('finish', function () {
			console.log('PDF closed');
		  });
		  var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
			user: 'flf.solucionesysistemas@gmail.com',
			pass: 'everLAST2020'
			}
		});
		
		var mailOptions = {
			from: 'LaCasonaWeb',
			to: emailProfesional,
			subject: 'Registro-primer-entrevista la casona web',
			text: "pruebo email.com",
			attachments: [
				{
					"path": './registro_entrevista/registro_entrevista_' +datos.id_cliente+ramdon+ '.pdf'                                         
					//contentType: 'application/pdf'
				}]
		};
		
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			console.log(error);
			res.status(400).json({
				mensaje:"No se envio el correo"
			})
			} else {
			console.log('Email enviado: ' + info.response);
			
			}
		});		
		  pdf.end();
		  res.status(200).json({
			mensaje:"Se genero y envio correctamente el registro de entrevista"
		})
	});
	
}

exports.getEntrevista = async (req, res) =>{
	let id = req.params.id;
	let sql = await pool.query('SELECT * FROM entrevista as e INNER JOIN persona as p ON e.id_persona=p.id_persona WHERE id_entrevista= ?',[id]);
	if(sql != null){
		console.log(sql);
		res.status(200).json(sql);
	}
	else{
		res.status(400).json({mensaje:"Error al traer datos"});
	}

}





