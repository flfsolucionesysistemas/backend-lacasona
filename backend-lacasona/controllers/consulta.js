const pool = require('../config/database');
var nodemailer = require('nodemailer');
const axios = require('axios');
const pdf = require('html-pdf');
const fs = require('fs');
const PDFDocument = require('pdfkit');
let administradores=[];
let emailProfesional;

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
				costo:costo_en
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
					
					 
						var transporter = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
							user: 'flf.solucionesysistemas@gmail.com',
							pass: 'everLAST2020'
							}
						});
						var emailCliente="Bienvenido a PSICOINTERACCION. Nos comunicamos con Ud. por que ha solicitado su primer entrevista";
						var emailAdmin="Se registro una nueva entrevista"
						
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

	axios.get('http://localhost:3000/users/getUserId/'+datos.id_profesional).then(resul=>
	emailProfesional=resul.data[0].email);
	
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
	let contenido ='<h1>Esto es un test de html-pdf</h1><p>Estoy generando PDF a partir de este código HTML sencillo</p>';
                  const doc = new PDFDocument;
                  doc.pipe(fs.createWriteStream("./testeer.pdf"));
                  const content = `
                  Código QR para la persona  
                  Gobierno de la Provincia de Corrientes - 2020
                  Mail: `;
                  doc.text(content, 100, 100);
                  doc.end();
	//pdf.create(contenido).toFile('./registro_entrevista/registro_entrevista_'+datos.id_cliente+'.pdf', function(err, res) {
	pdf.create(contenido).toFile('./registro_entrevista.pdf', function(err, res) {
		if (err){
			console.log(err);
		} else {
			console.log(res);
			fs.readFile('./salida.pdf',function(err,data){
				if(err)throw err;
				console.log(data);
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
					text: contenido,
					attachments: [
						{
							filename: './registro_entrevista/registro_entrevista_' + datos.id_cliente + '.pdf',                                         
							contentType: 'application/pdf'
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
					res.status(200).json({
						mensaje:"Se genero y envio correctamente el registro de entrevista"
					})
					}
				});			
			})
		}
	});
	

}
	
