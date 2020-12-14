const pool = require('../config/database');
const axios = require('axios');
const helpers = require('../config/helpers');

exports.addHC = async (req, res)=>{
    let datos = req.body;
    let id_persona_paciente = datos.id_persona;
    let id_persona_creacion = datos.id_persona_creacion;
    
    /*let clave_usuario= await helpers.encryptPassword(datos.dni);
    
    updateUser = {
        id_tipo_persona: 4,
        dni: datos.dni,
        nombre_usuario: datos.dni,
        clave_usuario: clave_usuario,
        estado: datos.estado,
        activo:1
        };
            
    await pool.query('UPDATE persona SET ? WHERE id_persona = ?', [updateUser, id_persona_paciente], function(err, result){
        if(err){
           console.log('No se ha podido guardar el paciente');
           console.log(err);
        }
        else{
            console.log('Se guardo el paciente');
        }
    });*/
    //utilizo metodo ya creado  
        axios.post('http://localhost:3000/users/add',{
            "id_persona": id_persona_paciente,
            "id_tipo_persona": 4,
            "dni": datos.dni,
            "estado": datos.estado
            
        })
        .then(function(res) {
          if(res.status==200 ) {
            console.log("OK");
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    
    let codigo_hc = datos.cgip;
    //console.log(codigo_hc);
    let newHC = {
        id_persona_paciente: id_persona_paciente,
        id_persona_creacion: id_persona_creacion,
        numero_historia_clinica: codigo_hc,
        fecha_creacion: new Date()
    };
    await pool.query('INSERT INTO historia_clinica set ?', [newHC], function(err, result){
      if(err){
          res.status(400).json({
              error: 'No se ha podido guardar el paciente'
          });
      }
      else{
          console.log(result.insertId);
          return res.status(200).send(result);
      }
  });
    
}

exports.addHCTratamiento= async(req,res)=>{
    let data = req.body;
   
    if(data!=null){
        await pool.query('INSERT INTO hc_tratamiento set ?', [data], function(err, sql){
            if(err){
                console.log(err);
                res.status(400).json({
                    mensaje: 'Ocurrio un problema al intentar guardar'
                });
            }
            else{
                console.log(sql);
                res.status(200).json({
                mensaje: 'Relacion HC y Tratamiento ok.'
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


exports.updateHCTra=async(req,res)=>{
    let datos = req.body;
    if(datos.id_hc_tratamiento!=null){
        await pool.query('UPDATE hc_tratamiento SET ? WHERE id_hc_tratamiento = ?', [datos, datos.id_hc_tratamiento ], function(err, sql){
            if(err){
                console.log(err);
                res.status(400).json({
                    mensaje: 'Ocurrio un problema al modificar la asignacion de tratamiento'
                });
            }
            else{
                console.log(sql);
                res.status(200).json({
                mensaje: 'Se modifico Tratamiento ok.'
                }); 
            }
        });
    }
    else{
        res.status(400).json({
            mensaje: 'Los datos no estan bien cargados'
        });
    }
    
}

exports.addEvolucion=async(req,res)=>{
    let datos = req.body;
      result= await pool.query('SELECT e.fase,e.id_evolucion FROM evolucion as e where e.es_evolucion=0 and e.id_hc_tratamiento='+datos.id_hc_tratamiento+' order by e.id_evolucion desc limit 1')
      console.log(result[0]);
      if (datos.fase==result[0].fase){
         
      resultUpdate= await pool.query('UPDATE evolucion SET avanzo=1 WHERE id_evolucion = '+result[0].id_evolucion); 
      console.log(resultUpdate+"update");
    }
    
    await pool.query('INSERT INTO evolucion set ?', [datos], function(err, sql){
        if(err){
            console.log(err);
            res.status(400).json({
                mensaje: 'Ocurrio un problema al intentar guardar'
            });
        }
        else{
            console.log(sql);
            res.status(200).json({
            mensaje: 'Seguardo correctamente',
            sql:sql
            }); 
        }
    });
}

exports.getHCPorPersona= async (req, res) =>{
    let valor = req.params.idPersona;
	console.log(valor);
	let body = await pool.query ('SELECT * FROM historia_clinica WHERE id_persona_paciente = ?', [valor]);
	
    if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}


exports.getHCTratamientoPorHC= async (req, res) =>{
    let valor = req.params.idHC;
	/*console.log(valor);*/
	let body = await pool.query ('SELECT * FROM hc_tratamiento WHERE id_hc = ?', [valor]);
	
    if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}


exports.getHCTratamientoSinFechaAlta= async (req, res) =>{
    /*let valor = req.params.idPaciente;*/
	
	let body = await pool.query ('SELECT p.id_persona, p.nombre, p.apellido, p.dni, t.programa_tratamiento, hct.fecha_inicio, hct.fecha_alta, hc.numero_historia_clinica ' +
			'FROM persona AS p ' +
			'INNER JOIN historia_clinica AS hc ON hc.id_persona_paciente = p.id_persona ' + 
			'INNER JOIN hc_tratamiento AS hct ON hct.id_hc = hc.id_historia_clinica ' +
			'INNER JOIN tratamiento AS t ON t.id_tratamiento = hct.id_tratamiento ' + 
			'WHERE hct.fecha_alta is null');
		
    if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}

