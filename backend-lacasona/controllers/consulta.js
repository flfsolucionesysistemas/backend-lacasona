const pool = require('../config/database');
const jwt = require('../config/jwt');
const helpers = require('../config/helpers');

exports.addConsulta= async (req, res) =>{
    let variable = req.body;
	    
    let result;
    let newUser = {};
    newUser = {
				id_tipo_persona: 3,				
				nombre: variable.nombre,
				apellido: variable.apellido,
				email: variable.email,
				telefono: variable.telefono,				
				id_localidad: variable.id_localidad,
				activo:1
				};				
	result = await pool.query('INSERT INTO persona set ?', [newUser]);
		
    if(result != null){
        //res.status(200).send({idPeronsa});       
		let idPersona = result.insertId;
	
		newEntrevista = {
				id_persona: idPersona,				
				fecha_creacion: Now(),
				costo:1000
				};				
		result = await pool.query('INSERT INTO entrevista set ?', [newEntrevista]);
		
		let idEntrevista = result.insertId;
		if(result != null){
			res.status(200).send({idEntrevista});       
		}else{
			return res.status(400).json({
				error:'error al crear la entrevista'            
			});
		}
    }
    else{
        return res.status(400).json({
            error:'error al crear el usuario tipo 3'            
        }); 
    }

}

