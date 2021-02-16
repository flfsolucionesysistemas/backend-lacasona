const pool = require('../config/database');
const jwt = require('../config/jwt');
const helpers = require('../config/helpers');
const conex = require('../config/config');


exports.getTiposPersonaGestionables= async (req, res) =>{

    let body = await pool.query ('SELECT * FROM tipo_persona WHERE activo = 1 and gestionable = 1;');

    if(body != null){
        res.status(200).send({body});
    }
    else{
        return res.status(400).json({
            ok:false
        });
    }
}


exports.getTiposPersona= async (req, res) =>{
        
    let body = await pool.query ('SELECT * FROM tipo_persona WHERE activo = 1;');
	
    if(body != null){
        res.status(200).send({body});       
    }
    else{
        return res.status(400).json({
            ok:false            
        }); 
    }
}
