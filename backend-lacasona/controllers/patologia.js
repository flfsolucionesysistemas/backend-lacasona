const pool = require('../config/database');

exports.addPatologia= async(req,res)=>{
    let data = req.body;
   
    if(data!=null){
        await pool.query('INSERT INTO patologia set ?', [data], function(err, sql){
            if(err){
                console.log(err);
                res.status(400).json({
                    mensaje: 'Ocurrio un problema al intentar guardar'
                });
            }
            else{
                console.log(sql);
                res.status(200).json({
                mensaje: 'La patologia se cargo con exito'
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

exports.updatePatologia = async(req,res)=>{
    let data = req.body;
    await pool.query('UPDATE patologia SET ? WHERE id_patologia = ?', [data,data.id_patologia], function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                mensaje: 'Ocurrio un problema al intentar modificar'
            });
        }
        else{
            console.log(sql);
            res.status(200).json({
            mensaje: 'La patologia se modifico con exito'
            }); 
        }
    });
}
exports.listaPatologia=async(req,res)=>{
    await pool.query('SELECT * FROM patologia', function(err, lista_patologia){
        if (err) {
            res.json({
                resultado: false,
                mensaje: 'No se pudieron listar las patologias',
                err
            });
        } else {
            res.json({
                resultado: true,
                mensaje: 'Las patologias se listaron adecuadamente',
                lista_patologia
            });
        }
    });
}

exports.listaPatologiaActivos=async(req,res)=>{
    let valor = req.params.valor ;
    if(valor== 0||valor ==1){ 
       await pool.query('SELECT * FROM patologia where activo = ?',[valor] , function(err, lista_patologia){
        if (err) {
            res.json({
                resultado: false,
                mensaje: 'No se pudieron listar las patologias',
                err
            });
        } else {
            res.json({
                resultado: true,
                mensaje: 'Las patologias se listaron adecuadamente',
                lista_patologia
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