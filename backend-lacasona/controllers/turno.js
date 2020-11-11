const pool = require('../config/database');
const jwt = require('../config/jwt');
const helpers = require('../config/helpers');


exports.getTrunosEntrevista = async (req, res) =>{
    
	//let body = await pool.query ('SELECT * FROM turno WHERE turno_tratamiento = 0 and estado = 1 and fecha >= now()');
	
	let body = await pool.query ('SELECT * FROM turno WHERE turno_tratamiento = 0 and estado = 1 and fecha >= CURDATE() and hora <= DATE_FORMAT(NOW( ), "%H:%i:%S")');
	
	
    if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}