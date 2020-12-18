const pool = require('../config/database');
const axios = require('axios');

exports.add=async(req,res)=>{
    let datos = req.body;       
        await pool.query('INSERT INTO tratamiento set ?', [datos], function(err, sql){
            if(err){
                console.log(err);
                res.status(400).json({
                    error: 'No se ha podido guardar el tratamiento'
                });
            }
            else{
                res.status(200).send({sql});
            }
        });
          
}

exports.updateTratamiento = async(req,res)=>{
    let data = req.body;
    await pool.query('UPDATE tratamiento SET ? WHERE id_tratamiento = ?', [data,data.id_tratamiento], function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                mensaje: 'Ocurrio un problema al intentar modificar'
            });
        }
        else{
            console.log(sql);
            res.status(200).json({
            mensaje: 'El tratamiento se modifico con exito'
            }); 
        }
    });
}
exports.listaTratamientos=async(req,res)=>{
    await pool.query('SELECT * FROM tratamiento', function(err, lista_tratamiento){
        if (err) {
            res.json({
                resultado: false,
                mensaje: 'No se pudieron listar los tratamientos',
                err
            });
        } else {
            res.json({
                resultado: true,
                mensaje: 'los tratamientos se listaron adecuadamente',
                lista_tratamiento
            });
        }
    });
}

exports.listaTratamientosActivos=async(req,res)=>{
    let valor = req.params.valor ;
    if(valor== 0||valor ==1){ 
       await pool.query('SELECT * FROM tratamiento where activo = ?',[valor] , function(err, lista_tratamientos){
        if (err) {
            res.json({
                resultado: false,
                mensaje: 'No se pudieron listar los tratamientos',
                err
            });
        } else {
            res.json({
                resultado: true,
                mensaje: 'Los tratamientos se listaron adecuadamente',
                lista_tratamientos
            });
        }
      
      });
    }else {
    res.json({
        resultado: false,
        mensaje: 'El valor no corresponde a un parametro valido'
    });
}
}

exports.getTratamientoIdPaciente = async(req,res)=>{
    await pool.query('SELECT hct.id_tratamiento,hct.fecha_alta from hc_tratamiento as hct inner join historia_clinica as hc on hct.id_hc=hc.id_historia_clinica inner join persona as p on hc.id_persona_paciente=p.id_persona where p.id_persona='+req.params.idPaciente+' and hct.fecha_alta is null ', function(err, lista_tratamientos){
        if (err) {
            res.json({
                resultado: false,
                mensaje: 'No se pudieron listar los tratamientos',
                err
            });
        } else {
            if(lista_tratamientos[0]){
                console.log(lista_tratamientos[0].id_tratamiento);
                res.json({
                    resultado: true,
                    mensaje: 'Los tratamientos se listaron adecuadamente',
                    sql:lista_tratamientos
                });
                
            } 
            else{
                res.json({
                    resultado: true,
                    mensaje: 'No posee tratamientos en curso',
                    
                }); 
            }
            
        }
      
      });
}

exports.getTratamientoIdPacienteConInfoTratamiento = async(req,res)=>{
    await pool.query('SELECT hct.id_tratamiento,hct.fecha_alta, t.derivacion_psicoterapia, t.sesiones_grupales, t.sesiones_psiquiatricas, t.sesiones_psicologicas, t.frecuencia, t.abordaje, t.otras_prestaciones, t.tiempo_probable, t.programa_tratamiento, t.costo_mensual from hc_tratamiento as hct inner join historia_clinica as hc on hct.id_hc=hc.id_historia_clinica inner join persona as p on hc.id_persona_paciente=p.id_persona inner join tratamiento as t on t.id_tratamiento = hct.id_tratamiento where p.id_persona ='+req.params.idPaciente+' and hct.fecha_alta is null ', function(err, lista_tratamientos){
        if (err) {
            res.json({
                resultado: false,
                mensaje: 'No se pudieron listar los tratamientos',
                err
            });
        } else {
            if(lista_tratamientos[0]){
                console.log(lista_tratamientos[0].id_tratamiento);
                res.json({
                    resultado: true,
                    mensaje: 'Los tratamientos se listaron adecuadamente',
                    sql:lista_tratamientos
                });
                
            } 
            else{
                res.json({
                    resultado: true,
                    mensaje: 'No posee tratamientos en curso',
                    
                }); 
            }
            
        }
      
      });
}
exports.getEvolucionFase = async(req,res)=>{
    idPaciente=req.params.idPaciente;

    await pool.query('SELECT t.fases, e.fase, e.consideraciones_evaluacion,e.id_evolucion, e.fecha_creacion '+
					'FROM hc_tratamiento as hct '+
					'inner join tratamiento as t on hct.id_tratamiento=t.id_tratamiento '+
					'inner join evolucion as e on e.id_hc_tratamiento=hct.id_hc_tratamiento '+
					'inner join historia_clinica as hc on hct.id_hc=hc.id_historia_clinica '+
					'inner join persona as p on hc.id_persona_paciente=p.id_persona '+
					'where e.es_evolucion=0 and e.avanzo = 0 and p.id_persona ='+idPaciente+
					' order by e.id_evolucion asc' , function(err, sql){
        if (err) {
            res.json({
                resultado: false,
                mensaje: 'No se obtuvieron datos',
                err
            });
        } else {
            if(sql[0]){
                res.json({
                    resultado: true,
                    mensaje: 'La fase en la que se encuntra es',
                    sql:sql
                });
                
            } 
            else{
                res.json({
                    resultado: true,
                    mensaje: 'No posee tratamiento',
                    
                }); 
            }
            
        }
      
      });
}
exports.getEvolucionFaseActual = async(req,res)=>{
    idPaciente=req.params.idPaciente;

    await pool.query('SELECT t.fases, e.fase, e.consideraciones_evaluacion,e.id_evolucion, e.fecha_creacion '+
					'FROM hc_tratamiento as hct '+
					'inner join tratamiento as t on hct.id_tratamiento=t.id_tratamiento '+
					'inner join evolucion as e on e.id_hc_tratamiento=hct.id_hc_tratamiento '+
					'inner join historia_clinica as hc on hct.id_hc=hc.id_historia_clinica '+
					'inner join persona as p on hc.id_persona_paciente=p.id_persona '+
					'where e.es_evolucion=0 and e.avanzo = 0 and p.id_persona ='+idPaciente+
					' order by e.id_evolucion desc limit 1' , function(err, sql){
        if (err) {
            res.json({
                resultado: false,
                mensaje: 'No se obtuvieron datos',
                err
            });
        } else {
            if(sql[0]){
                res.json({
                    resultado: true,
                    mensaje: 'La fase en la que se encuntra es',
                    sql:sql
                });
                
            } 
            else{
                res.json({
                    resultado: true,
                    mensaje: 'No posee tratamiento',
                    
                }); 
            }
            
        }
      
      });
}