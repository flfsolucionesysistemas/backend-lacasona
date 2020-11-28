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
exports.listaTratamietos=async(req,res)=>{
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

exports.listaTratamietosActivos=async(req,res)=>{
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