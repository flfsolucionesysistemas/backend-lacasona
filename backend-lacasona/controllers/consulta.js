const pool = require('../config/database');
const conex = require('../config/config');
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

	//se obtienen datos de administradores para enviar info
	axios.get(conex.host+conex.port+'/users/getUserTipo/1').then(resul=>
	administradores=resul.data);
					
    let variable = req.body;
	let costo_en = variable.costo_entrevista;
	let tipo_pago;
	let meet;
	
	if(variable.forma_pago === "Transferencia Bancaria"){
		tipo_pago=2;
	}
	else if(variable.forma_pago==="Personalmente"){
		tipo_pago=3;
	}
	else{
		tipo_pago=1;
	}
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
					//se setea el id de marcelo como anfitrion
					const datos_zoom = await axios({
						url: conex.host+conex.port+'/turno/addMeeting/289',
						method: 'get'
					});
					console.log("datos zoom  "+datos_zoom.join_url);
					console.log("datos zoom  "+datos_zoom[0].join_url);
					console.log("datos zoom  "+datos_zoom[0]);
					//seteo el join_url para enviar por email
					meet=datos_zoom.join_url;	
					updateTurno = {
						id_tipo_turno: idEntrevista,
						turno_tratamiento: 0,
						estado: 0,
						observacion:'asignado  '+variable.nombre+'  '+variable.apellido,
						tipo_pago:tipo_pago,
						zoom_paciente: datos_zoom.join_url,
						zoom_profesiona: datos_zoom.start_url
						};
					//SE ASIGNA EL TURNO
						  
						result = await pool.query('UPDATE turno SET ? WHERE id_turno = ?', [updateTurno, variable.id_turno]);
						console.log(result);
					//SE ENVIAN LOS CORREOS ELECTRONICOS	
						const turnoasignado = await axios({
							url: conex.host+conex.port+'/turno/getTurnoId/'+variable.id_turno,
							method: 'get'
						});
						let mes =(new Date (turnoasignado.data[0].fecha)).getMonth();
						let fecha=(new Date (turnoasignado.data[0].fecha)).getDate()+'-'+meses[mes] +'-'+(new Date (turnoasignado.data[0].fecha)).getFullYear();
						console.log(fecha);

						
						if(variable.forma_pago === "Transferencia Bancaria"){
										
										var transporter = nodemailer.createTransport({
											host:"mail.lacasonacoop.com",
											post:2084,
											secure:false,
											auth: {
												user:'administracion@lacasonacoop.com',
												pass:'AvCastelli303'
											},
											tls: {
												rejectUnauthorized: false
											}									
									});
									
									var emailCliente="<h1>BIENVENIDO A LA CASONA WEB. </h1>"+
													"<h3>Datos de nuestra cuenta:</h3>"+
													"<p>-Banco: Credicoop</p>"+
													"<p>-A nombre de: Cooperativa de Trabajo en Salud Ramón Carrillo Limitada</p>"+
													"<p>-CUIT: 30-71135434-0</p>"+
													"<p>-CBU:19103758 55037559701146</p>"+
													"<p>El turno que ud. ha solicitado para Fecha:<em> "+fecha+". </em> Hora: <em>"+turnoasignado.data[0].hora+" </em></p>"+
													"<p>Será confirmado una vez que realice el pago<p>"+ 
													"<p>Rogamos puntualidad en la comunicación, muchas gracias."+
													"<p><h4>El enlace para acceder a la videollamada en la fecha señalada es el siguiente:   "+ meet+" </h4></p>";
									//var emailAdmin="Se acaba de registrar una nueva solicitud de consulta via web"
									var emailAdmin= 
										variable.apellido + ', ' + variable.nombre +							
										" ha solicitado una consulta para la fecha " + fecha +
										", a pagar por Trans. Bancaria."
									//sumar el meet de la reunion
									var mailOptionsCliente = {
										from: 'LaCasonaWeb',
										to: variable.email,
										bcc: 'administracion@lacasonacoop.com',										
										subject: ' TURNO CONFIRMADO',
										html: emailCliente
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
											//bcc: 'administracion@lacasonacoop.com',
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
								
							}
							else if(variable.forma_pago === "Personalmente"){
															
								var transporter = nodemailer.createTransport({
									host:"mail.lacasonacoop.com",
									post:2084,
									secure:false,
									auth: {
										user:'administracion@lacasonacoop.com',
										pass:'AvCastelli303'
									},
									tls: {
										rejectUnauthorized: false
									}
								});
								var emailCliente="<h1>BIENVENIDO A LA CASONA WEB. </h1>"+
												"<h3>Para pagar de manera presencial usted debe concurrir a nuestra sede administrativa ubicada en Av. Castelli 303 de la ciudad de Resistencia (Chaco, Argentina)</p>"+
												"<p>El turno que ud. ha solicitado para Fecha:<em> "+fecha+". </em> Hora: <em>"+turnoasignado.data[0].hora+" </em></p>"+
												"<p>Será confirmado una vez que realice el pago<p>"+ 
												"<p>Rogamos puntualidad en la comunicación, muchas gracias."+
												"<p><h4>El enlace para acceder a la videollamada en la fecha señalada es el siguiente:   "+ meet+" </h4></p>";
								
								//var emailAdmin="Se acaba de registrar una nueva solicitud de consulta via web"
								var emailAdmin = variable.apellido + ', ' + variable.nombre +							
										" ha solicitado una consulta para la fecha " + fecha +
										", a pagar personalmente."
										
								//sumar el meet de la reunion
								var mailOptionsCliente = {
									from: 'LaCasonaWeb',
									to: variable.email,
									bcc: 'administracion@lacasonacoop.com',
									subject: ' TURNO CONFIRMADO',
									html: emailCliente
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
							}
							else{
									
										var transporter = nodemailer.createTransport({
											host:"mail.lacasonacoop.com",
											post:2084,
											secure:false,
											auth: {
												user:'administracion@lacasonacoop.com',
												pass:'AvCastelli303'
											},
											tls: {
												rejectUnauthorized: false
											}
										});
										
										var emailCliente="<h1>BIENVENIDO A LA CASONA WEB. </h1>"+
														"<p>El turno que ud. ha solicitado está confirmado para Fecha:<em> "+fecha+". </em> Hora: <em>"+turnoasignado.data[0].hora+" </em></p>"+
														"<p>Rogamos puntualidad en la comunicación, muchas gracias."+
														"<p><h4>El enlace para acceder a la videollamada en la fecha señalada es el siguiente:   "+ meet+" </h4></p>";
										//var emailAdmin="Se acaba de registrar una nueva solicitud de consulta via web"
										var emailAdmin = variable.apellido + ', ' + variable.nombre +							
											" ha solicitado una consulta para la fecha " + fecha +
											", a por Mercado Pago."
										//sumar el meet de la reunion
										var mailOptionsCliente = {
											from: 'LaCasonaWeb',
											to: variable.email,
											bcc: 'administracion@lacasonacoop.com',
											subject: ' TURNO CONFIRMADO',
											html: emailCliente
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
												//bcc: 'administracion@lacasonacoop.com',
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
									
								}
							}
							else{
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
	
	axios.put(conex.host+conex.port+'/users/updateUser',{
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
	axios.get(conex.host+conex.port+'/users/getUserId/'+datos.id_profesional)
	.then(function(resul){
		emailProfesional=resul.data[0].email
		console.log(emailProfesional);
		var pdf = new PDFDocument({
			size: 'LEGAL', // See other page sizes here: https://github.com/devongovett/pdfkit/blob/d95b826475dd325fb29ef007a9c1bf7a527e9808/lib/page.coffee#L69
			info: {
			  Title: 'Registro de Entrevista',
			  Author: 'La Casona Web',
			}
		  });
		  
		  pdf.fontSize(20)
			   .text('Formulario de Registración de Entrevista', 100, 100,{
				underline: true
			   })
			   .moveDown(0.5);;
		  pdf.fontSize(18)
		  	   .fillColor('blue')
			   .text('Admitido: '+datos.admitido)
			   .moveDown(0.5);
		  pdf.fontSize(11)
		  	   .fillColor('black')
			   .text('Fecha: '+datos.fecha)
			   .text('Tipo de consulta: '+datos.tipo_consulta)
			   .text('Obra social: '+datos.obra_social+   ' -  N° de afiliado: '+datos.numero_afiliado )
			   .text('D.N.I: '+datos.numero_documento)
			   .text('Fecha de nacimiento: '+datos.fecha_nacimiento)
			   .text('Domicilio: '+datos.domicilio+    '- Telefono: '+datos.telefono )
			   .text('Edad: '+datos.edad)
			   .text('Estado civil: '+datos.estado_civil+'  - Ocupación:'+datos.ocupacion )
			   .moveDown(0.5);
			   height = pdf.currentLineHeight();
		 pdf.fontSize(18)
		 	   .highlight(100, pdf.y, pdf.widthOfString('CGIP: '+datos.cgip), height)
			   .text('CGIP: '+datos.cgip)
			   .moveDown(0.5);	  
		 pdf.fontSize(11)
			   .text('Motivo: '+datos.motivo+' -  Derivado por: '+datos.derivado_por)
			   .text('Padecimiento: '+datos.padecimiento+' -  Antecedentes: '+datos.antecedentes)
			   .text('Diagnostico: '+datos.diagnostico+' -  Tratamiento: '+datos.tratamiento+' -  Farmacologia: '+datos.farmacologia );
		
		  pdf.pipe(
			fs.createWriteStream('/var/www/html/dist/registro/registro_entrevista_'+datos.id_cliente+'.pdf')
		  )
		  .on('finish', function () {
			console.log('PDF closed');
		  });

		  var transporter = nodemailer.createTransport({
				host:"mail.lacasonacoop.com",
				post:2084,
				secure:false,
				auth: {
					user:'administracion@lacasonacoop.com',
					pass:'AvCastelli303'
				},
				tls: {
					rejectUnauthorized: false
				}
		});
		
		var mailOptions = {
			from: 'LaCasonaWeb',
			to: emailProfesional,
			bcc: 'administracion@lacasonacoop.com',
			subject: 'Registro-primer-entrevista la casona web',
			text: " email.com",
			attachments: [
				{	
					"path": '/var/www/html/dist/registro/registro_entrevista_' +datos.id_cliente+'.pdf'
					
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





