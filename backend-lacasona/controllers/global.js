const pool = require('../config/database');
const jwt = require('../config/jwt');
const helpers = require('../config/helpers');

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
