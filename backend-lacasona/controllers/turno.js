const pool = require('../config/database');

exports.addTurno = async (req, res) =>{
    let data = req.body;
    console.log(data);
    if(data!= null){
         await pool.query('INSERT INTO turno set ?', [data], function(err, sql, fields){
            if(err){
                console.log(err);
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
exports.update = async (req, res)=>{
    let datos = req.body;
    let id_turno = datos.id_turno;
    await pool.query ('UPDATE turno SET ? WHERE id_turno = ?', [datos, id_turno],function(err,sql){
        if(err){
            res.status(400).json({
                error:"error al asignar turno"
            });
        }
        else{
            let query= sql.affectedRows;
             res.status(200).send({sql});
        }
    });
}
exports.getTurnosDisponiblesTipo = async (req, res) =>{
    let tipo = req.params.id_tipo;
    //id_tipo = 0 entrevista; id_tipo = 1 sesiones/programa
	
	let body = await pool.query ('SELECT * FROM turno WHERE turno_tratamiento = '+tipo+' and estado = 1 and (fecha > CURDATE() OR  (fecha = CURDATE() and hora >= DATE_FORMAT(NOW( ), "%H:%i:%S")))');
	//let body = await pool.query ('SELECT * FROM turno WHERE turno_tratamiento = '+tipo+' and estado = 1 and fecha >= CURDATE() and hora <= DATE_FORMAT(NOW( ), "%H:%i:%S")');
	if(body != null){
        res.status(200).send({body});      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}
//LISTA DE TURNOS ORDENADO POR FECHA DESCENDIENTE
exports.getTurnos = async (req, res) =>{
     
	let turnos = await pool.query ('SELECT * FROM turno ORDER BY fecha DESC');
	if(turnos != null){
        res.status(200).send(turnos);      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}
exports.getTurnosAsignados = async (req, res) =>{
     
	let turnos = await pool.query ('SELECT * FROM turno WHERE estado = 0 and (fecha > CURDATE() OR (fecha = CURDATE() and hora >= DATE_FORMAT(NOW( ), "%H:%i:%S"))) order by hora asc');
	if(turnos != null){
        res.status(200).send(turnos);      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}

exports.getTurnosLimit = async (req, res) =>{
     console.log(req.params.limit);
	let turnos = await pool.query ('SELECT * FROM turno ORDER BY fecha DESC limit '+req.params.limit);
	if(turnos != null){
        res.status(200).send(turnos);      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}

exports.asiganarTurno=async(req,res)=>{
    let datos=req.body;
    updateTurno = {
        id_tipo_turno: datos.id_tipo_turno,
        turno_tratamiento: datos.turno_tratamiento,
        estado: 0,
        observacion:'asignado'
        };
    await pool.query('UPDATE turno SET ? WHERE id_turno = ?', [updateTurno, datos.id_turno],function(err,sql){
        if(err){
            res.status(400).json({
                error:"error al asignar turno"
            });
        }
        else{
            let query= sql.affectedRows;
             res.status(200).send({query});
        }
    });
}