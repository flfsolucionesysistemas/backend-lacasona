const pool = require('../config/database');
const jwt = require('../config/jwt');
const helpers = require('../config/helpers');
const axios = require('axios');
const conex = require('../config/config');
var nodemailer = require('nodemailer');
const fs = require('fs');
const PDFDocument = require('pdfkit');

exports.loginUser= async(req, res)=>{
	var params = req.body	
	var nombreUser = params.usuario;
    var pass = params.clave;
		
    let row = await pool.query ('SELECT * FROM persona as p INNER JOIN tipo_persona as tp ON p.id_tipo_persona = tp.id_tipo_persona WHERE p.activo=1 AND p.nombre_usuario = ?', [nombreUser]);
		if (row[0]){
            let usuario = row[0];
            console.log(usuario);
            //COMPROBAR LA PASS
                //bcrypt.compare(pass, usuarioDb.pass, (err, check) => {;	
                let validPass = await helpers.marchPassword(pass, usuario.clave_usuario);
                console.log(validPass);
					if (validPass == true){
					// devolver datos del usuar logueado
						if(params.gethash){ 
						//SI RECIBE UN gethash DESDE EL POST
						//devolver un token de jwt
							res.status(200).send({
                                token: jwt.createToken(usuario),
                                message: "usuario logeado"
							});	
						}else{
                            res.status(200).send(usuario);
            
						}
					}else{
						res.status(400).send({message : 'El usuario no ha podido loguearse, revisar contraseña.'});	
					}
				
			}			
		else{			
				res.status(400).send({message :'El usuario no esta registrado.'});				
			}
		
	}	

exports.useradd= async (req, res) =>{
    let newUser = req.body;
    let tipo_user = newUser.id_tipo_persona;
    let clave_usuario;
    if(newUser.dni){
        clave_usuario= await helpers.encryptPassword(newUser.dni);
    }
        
    switch(tipo_user){
        case 3://persona cliente
                 await pool.query('INSERT INTO persona set ?', [newUser], function(err, result){
                        if(err){
                            res.status(400).json({
                                error: 'No se ha podido guardar el cliente'
                            });
                        }
                        else{
                            let query= result.insertId;
                             res.status(200).send({query});
                            //res.status(200).send(sql);
                        }
                    });
                        
            
            break;
        case 4://persona paciente, update de cliente
        
                updateUser = {
                    id_tipo_persona: tipo_user,
                    dni: newUser.dni,
                    nombre_usuario: newUser.dni,
                    clave_usuario: clave_usuario,
                    estado: newUser.estado,
                    activo:1
                    };
                await pool.query('UPDATE persona SET ? WHERE id_persona = ?', [updateUser, newUser.id_persona], function(err, result){
                    if(err){
                        res.status(400).json({
                            error: 'No se ha podido guardar el paciente'
                        });
                    }
                    else{
                        let query= result.affectedRows;
                        res.status(200).send({query});
                    }
                });
                    
            break;
        default://persona profesional o admin
          user = {
                    id_tipo_persona: tipo_user,
                    id_localidad: newUser.id_localidad,
                    dni: newUser.dni,
                    nombre: newUser.nombre,
                    apellido: newUser.apellido,
                    nombre_usuario: newUser.dni,
                    clave_usuario: clave_usuario,
                    email: newUser.email,
                    telefono: newUser.telefono,
                    activo:1
                    };
                   // user.clave_usuario= await helpers.encryptPassword(newUser.dni);
                    await pool.query('INSERT INTO persona set ?', [user], function(err, sql, fields){
                        if(err){
                            console.log(err);
                            res.status(400).json({
                                error: 'No se ha podido guardar el profesional'
                            });
                        }
                        else{
                            res.status(200).send({sql});
                        }
                    });
                        
    }
   
}

exports.updateUser = async (req, res) =>{
    let datos = req.body;
   
    await pool.query('UPDATE persona SET ? WHERE id_persona = ?',[datos,datos.id_persona],  function(err, sql, fields){
        if(err){
            console.log(err);
            res.status(400).json({

                error: 'No se ha modificar el usuario'
            });
        }
        else{
            res.status(200).send({sql});
        }
    });
}
exports.deleteUser = async (req, res) =>{
    let idUser = req.params.idUser;
    let result = await pool.query("UPDATE persona SET activo = 0 WHERE id_persona="+idUser);
    res.status(200).send({result});
}
exports.getUserActivo= async (req, res) =>{
    let valor = req.params.activos;
    let body
    console.log(req.params.activos);
    if(valor==='activos'){
        body = await pool.query ('SELECT * FROM persona WHERE activo = ?', [1]);
    }
    else if(valor==='inactivos'){
        body = await pool.query ('SELECT * FROM persona WHERE activo = ?', [0]);
    }
    else{
        body = await pool.query ('SELECT * FROM persona');
	
    }
    
    if(body != null){
        res.status(200).send({body});
       
    }
    else{
        return res.status(400).json({
            ok:false
            
        }); 
    }
}
exports.getUserId= async (req, res) =>{
    let valor = req.params.idUser;
   
    let body = await pool.query ('SELECT * FROM persona inner join tipo_persona on persona.id_tipo_persona=tipo_persona.id_tipo_persona WHERE id_persona = '+valor);
	//let body = await pool.query ('SELECT * FROM persona join localidad on localidad.id_localidad=persona.id_localidad WHERE id_persona = '+valor);
    if(body != null){
        res.status(200).send(body);
       
    }
    else{
        res.status(400).send("error"); 
    }
}

exports.getUserTipo= async (req, res) =>{
    let valor = req.params.tipo;
    
    let body = await pool.query ('SELECT * FROM persona WHERE activo = 1 and id_tipo_persona = ?', [valor]);
	
    if(body != null){
        res.status(200).send(body);
       
    }
    else{
        return res.status(400).json({
            ok:false
            
        }); 
    }
}


exports.getExisteUser= async (req, res) =>{
    let email = req.params.email;
    
    let body = await pool.query ('SELECT * FROM persona WHERE activo = 1 and email = ?', [email]);
	
    if(body != null){
        res.status(200).send(body);
       
    }
    else{
        return res.status(400).json({
            ok:false
            
        }); 
    }
}

exports.setFechaContrato = async (req, res) =>{
    fechaHoy = new Date();
    let datos = req.body.idPersona;
     update = {
        fecha_contrato : fechaHoy
        };
    
    sql = await pool.query('UPDATE persona SET ? WHERE id_persona = ? ',[update,datos]);
        if(sql!=null){
            //generar primer cupon con fecha actual mas 5 dias
            const persona = await axios({
                url:conex.host+conex.port+'/users/getUserId/'+datos,
                method:'get'
            });
            //setero fecha de vencimiento de cupon
            let numeroDia=new Date(persona.data[0].fecha_contrato);
            numeroDia.setDate(numeroDia.getDate()+5);
            numeroDia=numeroDia.getFullYear()+"-"+(numeroDia.getMonth()+1)+"-"+numeroDia.getDate();
                console.log("dia "+numeroDia);
                //obtengo el hc_tratamiento vigente del paciente
                const hc_tratamiento = await axios({
                    url:conex.host+conex.port+'/tratamiento/tratamientoIdPaciente/'+datos,
                    method:'get'
                }); 
                //obtengo el costo mensual del tratamiento
                const tratamiento =  await axios({
                    url:conex.host+conex.port+'/tratamiento/getTratamientoId/'+hc_tratamiento.data.sql[0].id_tratamiento,
                    method:'get'
                }); 
            //genero primer cupon de pago luego de haber haceptado los terminos y condiciones    
            axios({
                method:'post',
                url:conex.host+conex.port+'/global/addCupon',
                data:{
                    pagado:0,
                    total:tratamiento.data[0].costo_mensual,
                    id_hc_tratamiento:hc_tratamiento.data.sql[0].id_hc_tratamiento,
                    fecha_vencimiento:numeroDia
                }
            });
            res.status(200).send(sql);
        }  
        else{
            console.log(err);
            res.status(400).json({

                error: 'No se ha modificar el usuario'
            });
        }

}

exports.olvideClave = async (req, res) =>{
    let email = req.params.email;
    let ramdon= Math.random().toString(36).substring(7);;
    let clave= await helpers.encryptPassword(ramdon);
    
    axios.get(conex.host+conex.port+'/users/getExisteUser/'+email)
      .then(function(resul) {
        axios.put(conex.host+conex.port+'/users/updateUser',{
            "id_persona":resul.data[0].id_persona,
            "clave_usuario":clave
        })
        .then(function(resul2) {
         var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user:'flf.solucionesysistemas@gmail.com',
            pass:'everLAST2020'
            //user: 'administracion@lacasonacoop.com',
            //pass: 'Castelli303'
            }
        });
        var emailCliente="<h1>Hola "+resul.data[0].nombre+" </h1>"+
                         "<p> Recibimos una solicitud para resetear su contraseña</p>"+
                         "<p>Nueva contraseña:  "+ramdon+"</p>"+
                         "<p><h4>Rogamos que modifique la misma una vez que ingrese al sitio </h4></p>";
        //sumar el meet de la reunion
        var mailOptionsCliente = {
            from: 'LaCasonaWeb',
            to: email,
            bcc:'flf.solucionesysistemas@gmail.com',
            subject: ' RECUPERACIÓN DE CONTRASEÑA',
            html: emailCliente
        };
        
        transporter.sendMail(mailOptionsCliente, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email enviado: ' + info.response);
            }
        });
        res.status(200).json({
            status:200
        });
      })
      .catch(function(err) {
        console.log(err);
        });
      })
      .catch(function(err) {
        console.log(err);
        });
 
}

exports.upadateClave= async (req, res) =>{
    let datos = req.body;
    let clave= await helpers.encryptPassword(datos.nueva);
    let row = await pool.query ('SELECT * FROM persona as p INNER JOIN tipo_persona as tp ON p.id_tipo_persona = tp.id_tipo_persona WHERE p.id_persona = ?', [datos.id_persona]);
		if (row[0]){
        let usuario = row[0];
        let validPass = await helpers.marchPassword(datos.actual, usuario.clave_usuario);
    console.log(validPass);
        if (validPass == true){
            axios({
                method:'put',
                url:conex.host+conex.port+'/users/updateUser',
                data:{
                    id_persona:datos.id_persona,
                    clave_usuario:clave
                }
            });
          
        }
        res.status(200).send(row);
    }
    else{
        console.log(err);
            res.status(400).json({

                error: 'No se ha modificar la clave'
            });
    }
}