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
	console.log(datos);
	console.log(id_turno);
    await pool.query ('UPDATE turno SET ? WHERE id_turno = ?', [datos, id_turno],function(err,sql){
        if(err){
			console.log(err);
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

//TURNOS FILTRADO POR TURNO_TRATAMIENTO (OSEA CONSULTA O TRATAMIEITNP)
exports.getTurnosDisponiblesTipoTodos = async (req, res) =>{
    let tipo = req.params.tipo;
	console.log(tipo);
	if(tipo==0){
		let body = await pool.query ('SELECT * '+
								' FROM turno WHERE turno_tratamiento = 0'+
								' and (fecha > CURDATE() OR  (fecha = CURDATE() and hora >= DATE_FORMAT(NOW( ), "%H:%i:%S")))' +
								'ORDER BY fecha asc, hora asc');
	
		if(body != null){
			res.status(200).send({body});      
		}
		else{
			return res.status(400).json({
				ok:false           
			}); 
		}
	}else{
		let body = await pool.query ('SELECT t.profesional_disponible, t.id_tipo_turno, id_paciente, t.id_turno, t.fecha,t.hora, t.estado, t.costo_base, t.observacion, t.turno_tratamiento, t.id_profesional , p.nombre, p.apellido ' +
				' FROM turno as t ' +
				' inner join persona as p on p.id_persona = t.id_profesional ' +
				' WHERE t.turno_tratamiento = 1 and (t.fecha > CURDATE() OR  (t.fecha = CURDATE() and t.hora >= DATE_FORMAT(NOW( ), "%H:%i:%S"))) ' +
				' ORDER BY t.id_profesional asc, t.fecha asc, t.hora asc');

		/*let body = await pool.query ('SELECT * FROM turno WHERE turno_tratamiento = '+tipo+
								' and (fecha > CURDATE() OR  (fecha = CURDATE() and hora >= DATE_FORMAT(NOW( ), "%H:%i:%S")))' +
								' ORDER BY id_profesional asc, fecha asc, hora asc');*/
		if(body != null){
			res.status(200).send({body});      
		}
		else{
			return res.status(400).json({
				ok:false           
			}); 
		}
	}
	
	//let body = await pool.query ('SELECT * FROM turno WHERE turno_tratamiento = '+tipo+' and estado = 1 and fecha >= CURDATE() and hora <= DATE_FORMAT(NOW( ), "%H:%i:%S")');
	
	
}

//LISTA DE TURNOS ORDENADO POR FECHA DESCENDIENTE y PROFESIONAL NULL, para la vista de turnos profesionales	
exports.getTurnosParaProfesionales = async (req, res) =>{
    let turnos = await pool.query ('SELECT fecha, id_turno, observacion, turno_tratamiento,hora, estado, id_tipo_turno, costo_base ' +
									'FROM turno ' + 
									'WHERE estado = 1 and id_profesional is null and turno_tratamiento = 1 and ' + 
									'(fecha > CURDATE() OR  (fecha = CURDATE() and hora >= DATE_FORMAT(NOW( ), "%H:%i:%S"))) ' +
									'ORDER BY fecha DESC'); 
	/*let turnos = await pool.query ('SELECT DATE_FORMAT(fecha,"%y-%m-%d") as fecha, id_turno, observacion, turno_tratamiento,hora, estado, id_tipo_turno, costo_base FROM turno ORDER BY fecha DESC');*/
	if(turnos != null){
        res.status(200).send(turnos);      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}



//LISTA DE TURNOS ORDENADO POR FECHA DESCENDIENTE
exports.getTurnos = async (req, res) =>{
    let turnos = await pool.query ('SELECT fecha, id_turno, observacion, turno_tratamiento,hora, estado, id_tipo_turno, costo_base ' +
									'FROM turno ' + 
									'WHERE estado = 1 and ' + 
									'(fecha > CURDATE() OR  (fecha = CURDATE() and hora >= DATE_FORMAT(NOW( ), "%H:%i:%S"))) ' +
									'ORDER BY fecha DESC'); 
	/*let turnos = await pool.query ('SELECT DATE_FORMAT(fecha,"%y-%m-%d") as fecha, id_turno, observacion, turno_tratamiento,hora, estado, id_tipo_turno, costo_base FROM turno ORDER BY fecha DESC');*/
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

exports.getTurnosFecha = async (req, res) =>{
     
	await pool.query ('SELECT * FROM turno where fecha ="'+req.params.fecha+'"' ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error al asignar turno"
            });
        }
        else{
            //let query= sql.affectedRows;
             res.status(200).send(sql);
        }
    });
}
exports.getTurnosFechas = async (req, res) =>{
     
	await pool.query ('SELECT * FROM turno where fecha BETWEEN "'+req.params.fecha1+'" AND "'+req.params.fecha2+'" order by id_turno asc' ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error al asignar turno"
            });
        }
        else{
             res.status(200).send(sql);
        }
    });
}

exports.getTurnoConsultaPrecio = async (req, res) =>{      
	
	await pool.query ('SELECT id_turno, costo_base, fecha FROM turno ' +
					  'WHERE turno_tratamiento = 0 and estado = 1 and costo_base > 0 order by id_turno desc limit 1 ' 
					  ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error consulta turno"
            });
        }
        else{
            //let query= sql.affectedRows;
             res.status(200).send(sql);
        }
    });
}


exports.getTurnosPorFechaYProfesional = async (req, res) =>{      
	let profesional=req.params.id_profesional;
	let fecha=req.params.fecha;
	
	await pool.query ('SELECT * FROM turno ' +
					  'WHERE turno_tratamiento = 1 and estado = 1 and costo_base = 0 and id_profesional = '+ profesional +
					  ' and fecha = "' + fecha + '" and profesional_disponible = 1 ' +
					  ' order by fecha' ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error consulta turno"
            });
        }
        else{            
             res.status(200).send(sql);
        }
    });
}

exports.getFechasTurnosSegunProfesional = async (req, res) =>{      
	let profesional=req.params.id_profesional;
	
	await pool.query ('SELECT distinct fecha FROM turno ' +
					  'WHERE turno_tratamiento = 1 and estado = 1 and costo_base = 0 and id_profesional = '+ profesional +
					  ' and (fecha > CURDATE() OR  (fecha = CURDATE() and hora >= DATE_FORMAT(NOW( ), "%H:%i:%S"))) ' +
					  ' order by fecha' ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error consulta turno"
            });
        }
        else{            
             res.status(200).send(sql);
        }
    });
}


exports.getTurnosFechaTipo = async (req, res) =>{
    if(req.params.tipo == 0){
		await pool.query ('SELECT t.id_turno, t.id_tipo_turno, t.costo_base, t.estado, t.fecha, t.hora,t.id_profesional, t.id_paciente, t.id_tipo_turno, t.observacion, t.profesional_disponible, t.turno_tratamiento'+ 
					' FROM turno as t' +
					' WHERE t.fecha ="'+req.params.fecha+'" AND t.turno_tratamiento="'+req.params.tipo+'" ' ,function(err,sql){
			if(err){
				console.log(err);
				res.status(400).json({
					error:"error al asignar turno"
				});
			}
			else{
				//let query= sql.affectedRows;
				 res.status(200).send(sql);
			}
		});	
	}else{
		if(req.params.tipo==1) {
			await pool.query ('SELECT t.id_turno, t.id_tipo_turno, t.costo_base, t.estado, t.fecha, t.hora,t.id_profesional, t.id_paciente, t.id_tipo_turno, t.observacion, t.profesional_disponible, t.turno_tratamiento, p.nombre, p.apellido, p.id_persona '+ 
						' FROM turno as t INNER JOIN persona as p on p.id_persona = t.id_profesional ' +
						' WHERE t.fecha ="'+req.params.fecha+'" AND t.turno_tratamiento="'+req.params.tipo+'" ' ,function(err,sql){
				if(err){
					console.log(err);
					res.status(400).json({
						error:"error al asignar turno"
					});
				}
				else{
					//let query= sql.affectedRows;
					 res.status(200).send(sql);
				}
			});
		}
	}
}