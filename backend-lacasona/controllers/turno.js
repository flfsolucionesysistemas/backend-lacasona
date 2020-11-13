const pool = require('../config/database');

exports.addTurno = async (req, res) =>{
    let data = req.body;
    
    if(data!= null){
         await pool.query('INSERT INTO turno set ?', [data], function(err, sql, fields){
            if(err){
                res.status(400).json({
                    error: 'No se ha podido guardar el turno'
                });
            }
            else{
                console.log('entra');
                res.status(200).send({sql,fields});
            }
        });
        
    }
    else{
        res.status(400).json({
            error: 'No exiten datos a guardar'
        });
    }
}
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