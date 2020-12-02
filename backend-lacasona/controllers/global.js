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
	let body = await pool.query ('SELECT idProvincia FROM localidad WHERE activo = 1 and id_provincia =' + valor);
	
    if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}