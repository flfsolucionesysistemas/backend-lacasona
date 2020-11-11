const pool = require('../config/database');
const jwt = require('../config/jwt');
const helpers = require('../config/helpers');


exports.getTrunosEntrevista = async (req, res) =>{
    
	let body = await pool.query ('SELECT * FROM turno WHERE turno_tratamiento = 0 and estado = 1');
	//and fecha >= now();
	
    if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}