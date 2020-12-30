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
   
    if(data!=null){
        await pool.query('INSERT INTO pago set ?', [data], function(err, sql){
            if(err){
                console.log(err);
                res.status(400).json({
                    mensaje: 'Ocurrio un problema al intentar guardar'
                });
            }
            else{
                console.log(sql);
                res.status(200).json({
                mensaje: 'Nuevo pago registrado'
                }); 
            }
        });
    }
    else{
        res.status(400).json({
            mensaje: 'No se obtuvieron correctamente los datos'
        });  
    }
}