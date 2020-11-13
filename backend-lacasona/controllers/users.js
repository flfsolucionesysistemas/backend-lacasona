const pool = require('../config/database');
const jwt = require('../config/jwt');
const helpers = require('../config/helpers');

exports.loginUser= async(req, res)=>{
	var params = req.body	
	var nombreUser = params.usuario;
    var pass = params.clave;
		
    let row = await pool.query ('SELECT * FROM persona INNER JOIN tipo_persona ON persona.id_tipo_persona = tipo_persona.id_tipo_persona WHERE nombre_usuario = ?', [nombreUser]);
		if (row){
            let usuario = row[0];
            console.log(usuario);
            //COMPROBAR LA PASS
                //bcrypt.compare(pass, usuarioDb.pass, (err, check) => {;	
                let validPass = await helpers.marchPassword(pass, usuario.clave_usuario);
                console.log(validPass);
					if (validPass == true){
					// devolver datos del usuar logueado
						if(params.gethash){ 
						//SI RECIBE UN gethash DESDE EL POST
						//devolver un token de jwt
							res.status(200).send({
                                token: jwt.createToken(usuario),
                                message: "usuario logeado"
							});	
						}else{
                            res.status(200).send(usuario);
            
						}
					}else{
						res.status(404).send({message : 'El usuario no ha podido loguearse, revisar contraseña.'});	
					}
				
			}			
		else{			
				res.status(404).send({message :'El usuario no esta registrado.'});				
			}
		
	}	

exports.useradd= async (req, res) =>{
    let newUser = req.body;
    let tipo_user = newUser.id_tipo_persona;
    
    switch(tipo_user){
        case 3://persona cliente
                 await pool.query('INSERT INTO persona set ?', [newUser], function(err, sql, fields){
                        if(err){
                            res.status(400).json({
                                error: 'No se ha podido guardar el cliente'
                            });
                        }
                        else{
                            console.log('entra');
                            res.status(200).send({sql});
                        }
                    });
                        
            
            break;
        case 4://persona paciente, update de cliente
            
                let clave_usuario= await helpers.encryptPassword(newUser.dni);
                //update table set ? where id = ?, [objeto,id]
                updateUser = {
                    id_tipo_persona: tipo_user,
                    dni: newUser.dni,
                    nombre_usuario: newUser.dni,
                    clave_usuario: clave_usuario,
                    estado: newUser.estado,
                    activo:1
                    };
                await pool.query('UPDATE persona SET ? WHERE id_persona = ?', [updateUser, newUser.id_persona], function(err, sql, fields){
                    if(err){
                        res.status(400).json({
                            error: 'No se ha podido guardar el paciente'
                        });
                    }
                    else{
                        console.log('entra');
                        res.status(200).send({sql});
                    }
                });
                    
            break;
        default://persona profesional o admin
                user = {
                    id_tipo_persona: tipo_user,
                    id_localidad: newUser.localidad,
                    dni: newUser.dni,
                    nombre: newUser.nombre,
                    apellido: newUser.apellido,
                    nombre_usuario: newUser.dni,
                    clave_usuario: newUser.dni,
                    email: newUser.email,
                    telefono: newUser.telefono,
                    activo:1
                    };
                    user.clave_usuario= await helpers.encryptPassword(newUser.dni);
                    await pool.query('INSERT INTO persona set ?', [user], function(err, sql, fields){
                        if(err){
                            res.status(400).json({
                                error: 'No se ha podido guardar el profesional'
                            });
                        }
                        else{
                            console.log('entra');
                            res.status(200).send({sql});
                        }
                    });
                        
    }
   
}

exports.updateUser = async (req, res) =>{
    let datos = req.body;
   
    await pool.query('UPDATE persona SET ? WHERE id_persona = ?',[datos,datos.id_persona],  function(err, sql, fields){
        if(err){
            res.status(400).json({
                error: 'No se ha modificar el usuario'
            });
        }
        else{
            res.status(200).send({sql});
        }
    });
}
exports.deleteUser = async (req, res) =>{
    let idUser = req.params.idUser;
    let result = await pool.query("UPDATE persona SET activo = 0 WHERE id_persona="+idUser);
    res.status(200).send({result});
}
exports.getUserActivo= async (req, res) =>{
    let valor = req.params.activos;
    let setValor;
    console.log(req.params.activos);
    if(valor==='activos'){
        setValor=1;
    }
    else{
        setValor=0;
    }
    let body = await pool.query ('SELECT * FROM persona WHERE activo = ?', [setValor]);
	
    if(body != null){
        res.status(200).send({body});
       
    }
    else{
        return res.status(400).json({
            ok:false
            
        }); 
    }
}
exports.getUserId= async (req, res) =>{
    let valor = req.params.idUser;
    console.log(req.params.idUser);
    
    let body = await pool.query ('SELECT * FROM persona join localidad on localidad.id_localidad=persona.id_localidad WHERE id_persona = '+valor);
	
    if(body != null){
        res.status(200).send({body});
       
    }
    else{
        res.status(400).send("error"); 
    }
}

exports.getUserTipo= async (req, res) =>{
    let valor = req.params.tipo;
    
    let body = await pool.query ('SELECT * FROM persona WHERE id_tipo_persona = ?', [valor]);
	
    if(body != null){
        res.status(200).send({body});
       
    }
    else{
        return res.status(400).json({
            ok:false
            
        }); 
    }
}