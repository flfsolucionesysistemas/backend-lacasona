const pool = require('../config/database');
const axios = require('axios');
const conex = require('../config/config');

exports.addTurno = async (req, res) =>{
    let data = req.body;
    console.log(data);
    /*axios.get(conex.host+conex.port+'/turno/getTurnoFecha/'+data.fecha)
        .then(function(resul) {
        if(data.hora!=resul.data)
        })
        .catch(function(err) {
            console.log(err);
            });
        */
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

	if (datos.observacion === 'GRUPAL' && datos.id_profesional != 0) {
		
		let id_profesional = datos.id_profesional;
		const datos_zoom = await axios({
							url: conex.host+conex.port+'/turno/addMeeting/289' ,
							method: 'get'
						});
		/*
		const datos_zoom = await axios({
							url: conex.host+conex.port+'/turno/addMeeting/' + id_profesional,
							method: 'get'
						});				
		*/
		console.log('datos_zoom.data.join_url ', datos_zoom.data.join_url);
		console.log('data.join_url ', data.join_url);

		datos = {		
			observacion: 'GRUPAL',
			'id_tipo_sesion':3,
			estado: 0,
			zoom_paciente: datos_zoom.data.join_url,
			zoom_profesional: datos_zoom.data.start_url
		};

	}else{
		let id_profesional = datos.id_profesional;
		/*
		const datos_zoom = await axios({
							url: conex.host+conex.port+'/turno/addMeeting/289' ,
							method: 'get'
						});
		*/
		const datos_zoom = await axios({
							url: conex.host+conex.port+'/turno/addMeeting/' + id_profesional,
							method: 'get'
						});				
		
		console.log('datos_zoom.data.join_url ', datos_zoom.data.join_url);
		console.log('datos_zoom.data.start_url ', datos_zoom.data.start_url);

		datos = {				
			id_paciente: datos.id_paciente, 
			id_tipo_sesion : datos.id_tipo_sesion,
			estado: 0,
			observacion: datos.observacion,			
			zoom_paciente: datos_zoom.data.join_url,
			zoom_profesional: datos_zoom.data.start_url
		};
	}
	
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

exports.delete = async (req, res)=>{
    let datos = req.body;
    let id_turno = datos.id_turno;

    await pool.query ('DELETE FROM turno WHERE id_turno = ' + id_turno , function(err,sql){
        if(err){
			console.log(err);
            res.status(400).json({
                error:"error al borrar turno"
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

exports.getTurnosAsignadosAPacientes = async (req, res) =>{
    let id_paciente = req.params.id_paciente; 
	let turnos = await pool.query ('SELECT  p.nombre, p.apellido, t.id_turno, t.fecha, t.hora, t.observacion, t.turno_tratamiento, t.estado, t.id_tipo_turno, t.costo_base, t.id_paciente, t.profesional_disponible, t.id_profesional ' +
					' FROM turno as t ' +
					' INNER JOIN persona as p on p.id_persona = t.id_profesional ' +
					' WHERE t.estado = 0 and t.id_paciente = ' + id_paciente +
					' and (t.fecha > CURDATE() OR (t.fecha = CURDATE() and t.hora >= DATE_FORMAT(NOW( ), "%H:%i:%S"))) order by t.fecha, t.hora asc');
	if(turnos != null){
        res.status(200).send(turnos);      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}

exports.getProximoTurnoPaciente = async (req, res) =>{
    let id_paciente = req.params.id_paciente; 
	let turnos = await pool.query ('SELECT  p.nombre, p.apellido, t.id_turno, t.fecha, t.hora, t.observacion, t.turno_tratamiento, t.estado, t.id_tipo_turno, t.costo_base, t.id_paciente, t.profesional_disponible, t.id_profesional ' +
					' FROM turno as t ' +
					' INNER JOIN persona as p on p.id_persona = t.id_profesional ' +
					' WHERE t.estado = 0 and t.id_paciente = ' + id_paciente +
					' and (t.fecha > CURDATE() OR (t.fecha = CURDATE() and t.hora >= DATE_FORMAT(NOW( ), "%H:%i:%S"))) order by t.fecha asc limit 1');
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



exports.getTurnosEntrevistaAdmisionPorFecha = async (req, res) =>{      
	let fecha=req.params.fecha;
	
	await pool.query ('SELECT t.zoom_paciente, t.zoom_profesional,t.fecha, t.hora, p.nombre,p.apellido, p.telefono, p.email, p.id_persona FROM turno  AS t ' +
					  'INNER JOIN entrevista AS e ON e.id_entrevista = t.id_tipo_turno ' +
					  'INNER JOIN persona AS p ON p.id_persona = e.id_persona ' +
					  'WHERE t.fecha = "' + fecha + '" and t.turno_tratamiento=0 and p.estado is null; '
					  ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error entrevista de admision"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}


exports.getTurnosEntrevistaAdmision = async (req, res) =>{      
	let fecha=req.params.fecha;
	
	await pool.query ('SELECT t.fecha, t.hora, p.nombre,p.apellido, p.telefono, p.email, p.id_persona FROM turno  AS t ' +
					  'INNER JOIN entrevista AS e ON e.id_entrevista = t.id_tipo_turno ' +
					  'INNER JOIN persona AS p ON p.id_persona = e.id_persona ' +
					  'WHERE t.fecha > CURDATE() and t.turno_tratamiento=0 and p.estado is null; '
					  ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error entrevista de admision"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}

exports.getTurnosPorFechaYProfesional = async (req, res) =>{      
	let profesional=req.params.id_profesional;
	let fecha=req.params.fecha;
	
	await pool.query ('SELECT * FROM turno ' +
					  ' WHERE turno_tratamiento = 1 and estado = 1 and costo_base = 0 and id_profesional = '+ profesional +
					  ' and profesional_disponible = 1 and fecha = "' + fecha + '" '+
					  //' and hora >= DATE_FORMAT(NOW( ), "%H:%i:%S")) ' +
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
		await pool.query ('SELECT t.id_turno, t.id_tipo_turno, t.costo_base, t.estado, t.fecha, t.hora,t.id_profesional, t.id_paciente, t.id_tipo_turno, t.observacion, t.profesional_disponible, t.turno_tratamiento, t.zoom_profesional, t.zoom_paciente '+ 
					' FROM turno as t' +
					' WHERE t.fecha ="'+req.params.fecha+'" AND t.turno_tratamiento="'+req.params.tipo+'" order by hora' ,function(err,sql){
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
			await pool.query ('SELECT t.id_turno, t.id_tipo_turno, t.costo_base, t.estado, t.fecha, t.hora,t.id_profesional, t.id_paciente, t.id_tipo_turno, t.observacion, t.profesional_disponible, t.turno_tratamiento, p.nombre, p.apellido, p.id_persona, t.zoom_profesional, t.zoom_paciente '+ 
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

exports.getTurnoId = async (req, res) =>{
     
	await pool.query ('SELECT * FROM turno where id_turno ="'+req.params.id+'"' ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"ocurrio un error"
            });
        }
        else{
            if(sql[0]){
                res.status(200).send(sql);
            }
            else{
                res.status(400).json({
                    mensaje: "no existen datos"
                });
            }
        }
    });

}

exports.turnosGrupales = async (req, res) =>{      
	let datos=req.body;
	/*axios.put(conex.host+conex.port+'/turno/update',{
		"id_turno": datos.id_turno,
        "observacion": "GRUPAL",
        "id_tipo_sesion":datos.id_tipo_sesion,
        "estado":0		
	})
	.then(function(res) {
	  if(res.status==200 ) {
		console.log("OK");
	  }
	})
	.catch(function(err) {
	  console.log(err);
    });*/
    let data = {
        "id_paciente":datos.id_paciente,
        "id_turno":datos.id_turno
    }
	await pool.query ('INSERT INTO paciente_turno set ?', [data] ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}
exports.turnosGrupalesProfesional = async (req, res) =>{      
	let datos=req.body;
	
    let data = {
        "id_profesional":datos.id_profesional,
        "id_turno":datos.id_turno
    }
	await pool.query ('INSERT INTO profesional_turno set ?', [data] ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}

exports.getTurnosTipoIndividual = async (req, res) =>{      
	
    await pool.query ('SELECT * FROM turno as t INNER JOIN tipo_sesion as ts ON '+
                     't.id_tipo_sesion=ts.id_tipo_sesion inner join persona as p on p.id_persona=t.id_profesional '+
                     'WHERE t.id_paciente='+req.params.id,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}

exports.getTurnosTipoGrupal = async (req, res) =>{      
    await pool.query ('SELECT * FROM paciente_turno as tp INNER JOIN turno as t on '+
                     't.id_turno=tp.id_turno inner join tipo_sesion as ts on t.id_tipo_sesion=ts.id_tipo_sesion '+
                     'inner join persona as p on p.id_persona=t.id_profesional '+
                     'WHERE tp.id_paciente='+req.params.id,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}

exports.getTurnosTipoGrupalProfesional = async (req, res) =>{      
    await pool.query ('SELECT * FROM profesional_turno as tp '+
					 ' INNER JOIN turno as t on t.id_turno=tp.id_turno '+
                     ' INNER JOIN tipo_sesion as ts on t.id_tipo_sesion=ts.id_tipo_sesion '+
                     ' INNER JOIN persona as p on p.id_persona=tp.id_profesional '+
                     ' WHERE tp.id_turno='+req.params.id,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}

exports.getTurnosGrupalesProfesional = async (req, res) =>{      
    await pool.query ('SELECT * FROM profesional_turno as tp INNER JOIN turno as t on '+
                     't.id_turno=tp.id_turno inner join tipo_sesion as ts on t.id_tipo_sesion=ts.id_tipo_sesion '+
                     'inner join persona as p on p.id_persona=tp.id_profesional '+
                     'WHERE tp.id_profesional='+req.params.id,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}

exports.deleteTurnoGrupal = async (req, res)=>{
    let id_paciente_turno = req.params.id_paciente_turno;
    
    await pool.query ('DELETE FROM paciente_turno WHERE id_paciente_turno = ' + id_paciente_turno , function(err,sql){
        if(err){
			console.log(err);
            res.status(400).json({
                error:"error al borrar turno"
            });
        }
        else{
            let query= sql.affectedRows;
             res.status(200).send(sql);
        }
    });
}

exports.deleteTurnoGrupalProfesional = async (req, res)=>{
    let id_profesional_turno = req.params.id_profesional_turno;
    
    await pool.query ('DELETE FROM profesional_turno WHERE id_profesional_turno = ' + id_profesional_turno , function(err,sql){
        if(err){
			console.log(err);
            res.status(400).json({
                error:"error al borrar turno"
            });
        }
        else{
            let query= sql.affectedRows;
             res.status(200).send(sql);
        }
    });
}

exports.deleteTurnoGrupalProfesionalPorTurno = async (req, res)=>{
    let id_turno = req.params.id_turno;
    
    await pool.query ('DELETE FROM profesional_turno WHERE id_turno = ' + id_turno , function(err,sql){
        if(err){
			console.log(err);
            res.status(400).json({
                error:"error al borrar turno"
            });
        }
        else{
            let query= sql.affectedRows;
             res.status(200).send(sql);
        }
    });
}


exports.getTurnosGrupales = async (req, res) =>{      
    await pool.query ('SELECT * FROM paciente_turno as tp INNER JOIN turno as t on '+
                     't.id_turno=tp.id_turno inner join tipo_sesion as ts on t.id_tipo_sesion=ts.id_tipo_sesion '+
                     'inner join persona as p on p.id_persona=tp.id_paciente '+
                     'WHERE tp.id_turno='+req.params.id,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}
exports.getProximoTurnoGrupal = async (req, res) =>{      
    await pool.query ('SELECT * FROM paciente_turno as pt inner join turno as t on t.id_turno=pt.id_turno '+
                     'inner join persona as p on p.id_persona=t.id_profesional WHERE t.estado = 0 '+
                     'and pt.id_paciente ='+req.params.id+' and (t.fecha > CURDATE() OR (t.fecha = CURDATE() and t.hora >= DATE_FORMAT(NOW( ), "%H:%i:%S"))) '+
                     'order by t.fecha asc limit 1',function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}

/*
TURNOS GRUPALES EN LOS QUE PARTICIPA EL PROFESIONAL 
FILTRADO POR FECHA
*/
exports.getTurnosGrupalesComoAdicional = async (req, res) =>{          
	//await pool.query ('SELECT p.nombre, p.apellido, t.id_profesional,t.fecha, t.hora '+	
	await pool.query ('SELECT t.id_turno, t.id_tipo_turno, t.costo_base, t.estado, t.fecha, t.hora, '+
					' t.id_profesional, t.id_paciente, t.id_tipo_turno, t.observacion, t.profesional_disponible, ' +
					' t.turno_tratamiento, t.zoom_paciente, t.zoom_profesional, p.nombre, p.apellido, p.id_persona ' + 
					' FROM profesional_turno as pt ' +
					' INNER JOIN turno as t on t.id_turno = pt.id_turno ' + 
					' INNER JOIN persona as p on p.id_persona = t.id_profesional ' + 
					' WHERE pt.id_profesional = ' + req.params.id_profesional +
					' AND t.fecha = "' + req.params.fecha +  '"' +
					' AND t.id_tipo_sesion = 3 ',function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}   


exports.getProfesionalTitularTurnoGrupal = async (req, res) =>{          
	await pool.query ('SELECT p.nombre, p.apellido, p.email ' + 
					' FROM turno as t ' +
					' INNER JOIN persona as p on p.id_persona = t.id_profesional ' + 
					' WHERE id_turno= '+ req.params.id_turno ,function(err,sql){
        if(err){
            console.log(err);
            res.status(400).json({
                error:"error"
            });
        }
        else{           
             res.status(200).send(sql);
        }
    });
}   
