const pool = require('../config/database');
//const jwt = require('../config/jwt');
//const helpers = require('../config/helpers');
var nodemailer = require('nodemailer');
const axios = require('axios');
let administradores=[];

exports.getLocalidadesPorProvincia= async (req, res) =>{
    let valor = req.params.idProvincia;
	console.log(valor);
	let body = await pool.query ('SELECT * FROM localidad WHERE id_provincia = ?', [valor]);
	
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
    
	let body = await pool.query ('SELECT * FROM provincia WHERE activo = 1');
	
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
        url:'http://localhost:3000/users/getUserTipo/1',
        method:'get'
    });
    console.log(admin);
    administradores=admin.data;
    const response = await axios({
        url: 'http://localhost:3000/users/getUserId/'+id_persona,
        method: 'get'
      });
    if(response){
       
    //SE ENVIAN LOS CORREOS ELECTRONICOS	
					 
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: 'flf.solucionesysistemas@gmail.com',
        pass: 'everLAST2020'
        }
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
    let pago = {
        fecha: data.date_created,
        total: data.total,
        estado: data.estado,
        pago_tratamiento: data.pago_tratamiento,
        id_mercadopago: data.id_mercadopago,
        estado_mercadopago: data.estado_mercadopago,
    }  
    if(data!=null){
        let res = await pool.query('INSERT INTO pago set ?', [pago]);
            if(res != null){
                console.log(res);
                let consulta ={
                    nombre:data.nombre,
                    apellido:data.apellido,
                    email:data.email,
                    telefono:data.telefono,
                    id_localidad:data.id_localidad,
                    id_turno:data.id_turno,
                    costo_entrevista:data.costo_entrevista,
                    id_pago:res.insertId
                    }
                const addConsulta = await axios({
                    url: 'http://localhost:3000/consulta/add/',
                    method: 'post',
                    data: consulta
                  });
                res.status(200).json({
                mensaje: 'Nuevo pago registrado'
                }); 
            }
            else{
                console.log(err);
                res.status(400).json({
                    mensaje: 'Ocurrio un problema al intentar guardar'
                });
            }
           
    }
    else{
        res.status(400).json({
            mensaje: 'No se obtuvieron correctamente los datos'
        });  
    }
}