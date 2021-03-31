const pool = require('../config/database');
const conex = require('../config/config');
//const jwt = require('../config/jwt');
//const helpers = require('../config/helpers');
var nodemailer = require('nodemailer');
const axios = require('axios');
let administradores=[];

exports.getLocalidadesPorProvincia= async (req, res) =>{
    let valor = req.params.idProvincia;
	console.log(valor);
	let body = await pool.query ('SELECT * FROM localidad WHERE id_provincia = ' + valor + ' ORDER BY nombre');
	
    if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}

exports.getProvincias= async (req, res) =>{
    
	let body = await pool.query ('SELECT * FROM provincia WHERE activo = 1 ORDER BY nombre');
	
    if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}

exports.getIdProvincia = async (req, res) =>{
    let valor = req.params.idLocalidad;
	let body = await pool.query ('SELECT id_provincia FROM localidad WHERE id_localidad =' + valor);
	
    if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}


exports.updateProvincia = async (req, res) =>{
    let datos = req.body;
   
    await pool.query('UPDATE provincia SET ? WHERE id_provincia= ?',[datos,datos.id_provincia],  function(err, sql, fields){
        if(err){
            res.status(400).json({
                error: 'No se ha podido modificar la provincia'
            });
        }
        else{
            /*res.status(200).send({sql});*/
			res.status(200).json({sql, mensaje: 'Provincia actualizada'}); 
        }
    });
}

exports.getLecturaHC =  async(req, res)=>{
    id_persona = req.params.idPersona;
    const admin= await axios({
        url:conex.host+conex.port+'/users/getUserTipo/1',
        method:'get'
    });
    console.log(admin);
    administradores=admin.data;
    const response = await axios({
        url: conex.host+conex.port+'/users/getUserId/'+id_persona,
        method: 'get'
      });
    if(response){
       
    //SE ENVIAN LOS CORREOS ELECTRONICOS	
					 
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
						 
    /*var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: 'flf.solucionesysistemas@gmail.com',
        pass: 'everLAST2020'
        }*/
    });
    var emailAdmin="El paciente con D.N.I:"+response.data[0].dni+" solicita ver su historia clinica";
   console.log(administradores[0].email);
    for(var i=0; i<administradores.length; i++){
        console.log(administradores[i].email);
        var mailOptionsAdmin = {
            from: 'LaCasonaWeb',
            to: administradores[i].email,
            subject: 'Solicitud de Historia Clinica',
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
        mensaje:"Se envio el correo Electronico"
    });
        
    }else{
        return res.status(400).json({
            status:400,
            mensaje:'No se ha podido enviar el correo'            
        });
    }	

    

}

exports.addPago =  async(req, res)=>{
    let data = req.body;
    let now = new Date();
       if(data.estado_mercadopago==="COBRO MANUAL"){
        let pago = {
            fecha: now,
            total: data.costo,
            estado:"Aprobado",
            pago_tratamiento: 0,
            estado_mercadopago: data.estado_mercadopago,
        }  
        let rest = await pool.query('INSERT INTO pago set ?', [pago]);
        console.log("nuevo pago"+rest);
                if(rest != null){
                    console.log(rest.insertId);
                     let datos ={
                        id_pago:rest.insertId
                        }
                        await pool.query('UPDATE entrevista SET ? WHERE id_entrevista = ?', [datos, data.id_entrevista ], function(err, sql){
                            if(err){
                                console.log(err);
                                res.status(400).json({
                                    mensaje: 'Ocurrio un problema al modificar '
                                });
                            }
                            else{
                                console.log(sql);
                                res.status(200).json({
                                mensaje: 'Se modifico ok.'
                                }); 
                            }
                        });
                    
                }
                else{
                    res.status(400).json({
                        mensaje: 'Ocurrio un problema al intentar guardar'
                    });
                }
                res.status(200).json({
                mensaje: 'Nuevo pago registrado'
                   }); 
    }
    else if(data.estado_mercadopago==="COBRO MANUAL TRATAMIENTO"){
        let pago = {
            fecha: now,
            total: data.costo,
            estado: "aprobado",
            pago_tratamiento: 1,
            estado_mercadopago: data.estado_mercadopago,
        }  
        if(data!=null){
            let rest = await pool.query('INSERT INTO pago set ?', [pago]);
                if(rest != null){
                    //updatear el cupon
                    let cupon={
                        id_cupon:data.id_cupon,
                        pagado: 1
                    }
                   
                    const updateCupon = await axios({
                        url: conex.host+conex.port+'/global/updateCupon/',
                        method: 'put',
                        data: cupon
                      });
                    
                }
                else{
                    res.status(400).json({
                        mensaje: 'Ocurrio un problema al intentar guardar'
                    });
                }
                res.status(200).json({
                mensaje: 'Nuevo pago registrado'
                   }); 
               
        }
        else{
            res.status(400).json({
                mensaje: 'No se obtuvieron correctamente los datos'
            });
        } 
    }
    else{

    if(data.pago_tratamiento==0){
        let pago = {
            fecha: data.fecha,
            total: data.total,
            estado: data.estado,
            pago_tratamiento: data.pago_tratamiento,
            id_mercadopago: data.id_mercadopago,
            estado_mercadopago: data.estado_mercadopago,
        }  
        if(data!=null){
            let rest = await pool.query('INSERT INTO pago set ?', [pago]);
                if(rest != null){
                     let consulta ={
                        nombre:data.nombre,
                        apellido:data.apellido,
                        email:data.email,
                        telefono:data.telefono,
                        id_localidad:data.id_localidad,
                        id_turno:data.id_turno,
                        costo_entrevista:data.costo_entrevista,
                        id_pago:rest.insertId
                        }
                    const addConsulta = await axios({
                        url: conex.host+conex.port+'/consulta/add/',
                        method: 'post',
                        data: consulta
                      });
                    
                }
                else{
                    res.status(400).json({
                        mensaje: 'Ocurrio un problema al intentar guardar'
                    });
                }
                res.status(200).json({
                mensaje: 'Nuevo pago registrado'
                   }); 
               
        }
        else{
            res.status(400).json({
                mensaje: 'No se obtuvieron correctamente los datos'
            });  
        }
    }
    else{
        let pago = {
            fecha: data.fecha,
            total: data.total,
            estado: data.estado,
            pago_tratamiento: data.pago_tratamiento,
            id_mercadopago: data.id_mercadopago,
            estado_mercadopago: data.estado_mercadopago,
        }  
        if(data!=null){
            let rest = await pool.query('INSERT INTO pago set ?', [pago]);
                if(rest != null){
                    //updatear el cupon
                    let cupon={
                        id_cupon:data.id_cupon,
                        pagado: 1
                    }
                   
                    const updateCupon = await axios({
                        url: conex.host+conex.port+'/global/updateCupon/',
                        method: 'put',
                        data: cupon
                      });
                    
                }
                else{
                    res.status(400).json({
                        mensaje: 'Ocurrio un problema al intentar guardar'
                    });
                }
                res.status(200).json({
                mensaje: 'Nuevo pago registrado'
                   }); 
               
        }
        else{
            res.status(400).json({
                mensaje: 'No se obtuvieron correctamente los datos'
            });  
        }
    }
}
    
}

exports.addCupon = async(req, res)=>{
    let body=req.body;
    await pool.query('INSERT INTO cupon set ?',[body],  function(err, sql){
        if(err){
            res.status(400).json({
                err,
                error: 'No se ha podido generar el cupon de pago'
            });
        }
        else{
            /*res.status(200).send({sql});*/
			res.status(200).json({sql, mensaje: 'Se genero el cupon de pago'}); 
        }
    });
}


exports.updateCupon = async(req, res)=>{
    datos=req.body;
    await pool.query('UPDATE cupon SET ? WHERE id_cupon = ?', [datos, datos.id_cupon ], function(err, sql){
        if(err){
            console.log(err);
            res.status(400).json({
                mensaje: 'Ocurrio un problema al modificar '
            });
        }
        else{
            console.log(sql);
            res.status(200).json({
            mensaje: 'Se modifico ok.'
            }); 
        }
    });
}
exports.getCuponid_hc = async(req, res)=>{
    const hc_tratamiento = await axios({
        url: conex.host+conex.port+'/hc/getHCTratamientoPorHC/'+req.params.id_hc,
        method: 'get'
      });
     console.log(hc_tratamiento.data.body[0]); 
    await pool.query('SELECT * from cupon WHERE id_hc_tratamiento ='+hc_tratamiento.data.body[0].id_hc_tratamiento,  function(err, sql){
        if(err){
            res.status(400).json({
                err,
                error: 'No existen cupones de pago'
            });
        }
        else{
            /*res.status(200).send({sql});*/
			res.status(200).json(sql); 
        }
    });
}

exports.getCuponid_hclimit = async(req, res)=>{
    const hc_tratamiento = await axios({
        url: conex.host+conex.port+'/hc/getHCTratamientoPorHC/'+req.params.id_hc,
        method: 'get'
      });
     console.log(hc_tratamiento.data.body[0]); 
    await pool.query('SELECT * from cupon WHERE id_hc_tratamiento ='+hc_tratamiento.data.body[0].id_hc_tratamiento+' order by id_cupon desc limit 1',  function(err, sql){
        if(err){
            res.status(400).json({
                err,
                error: 'No existen cupones de pago'
            });
        }
        else{
           
			res.status(200).json(sql); 
        }
    });
}

exports.controlPagos = async(req, res)=>{
    let fechaHoy= new Date();
    let body = await pool.query ('SELECT * FROM cupon as c '+
      'INNER JOIN hc_tratamiento as hct on c.id_hc_tratamiento=hct.id_hc_tratamiento '+
      'INNER JOIN historia_clinica as hc on hct.id_hc= hc.id_historia_clinica WHERE c.pagado=0 AND c.fecha_vencimiento < ?',[fechaHoy] );
    if(body!=null){
        for(var i=0; i<body.length; i++){
            
                const user = await axios({
                    url: conex.host+conex.port+'/users/deleteUser/'+body[i].id_persona_paciente,
                    method: 'delete'
                  }); 
               //agregar email para avisar al admin
        }
        
        res.status(200).json(body);
    }
    
    else{
        res.status(400).json({
            err,
            error: 'No existen cupones de pago'
        });
    }
	
}

exports.getTipoSesionIndividual= async(req, res)=>{
    
    await pool.query('SELECT * FROM tipo_sesion WHERE individual= 1 AND activo = 1 ',  function(err, sql){
        if(err){
            res.status(400).json({
                err,
                error: 'No existen tipo de sesiones'
            });
        }
        else{
           
			res.status(200).json(sql); 
        }
    });
}
exports.getTipoSesionGrupal= async(req, res)=>{
    
    await pool.query('SELECT * FROM tipo_sesion WHERE individual= 0 AND activo = 1 ',  function(err, sql){
        if(err){
            res.status(400).json({
                err,
                error: 'No existen tipo de sesiones'
            });
        }
        else{
           
			res.status(200).json(sql); 
        }
    });
}


