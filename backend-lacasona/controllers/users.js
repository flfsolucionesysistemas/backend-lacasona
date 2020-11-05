const pool = require('../config/database');
const jwt = require('../config/jwt');
const helpers = require('../config/helpers');

exports.loginUser= async(req, res)=>{
    console.log(req.body);

	var params = req.body	
	var nombreUser = params.usuario;
    var pass = params.clave;
    
    // ('SELECT * FROM persona WHERE nombre_usuario = ?', [nombreUser]);    
    let row = await pool.query (' SELECT * FROM persona ' +
                                ' INNER JOIN tipo_persona ON persona.id_tipo_persona = tipo_persona.id_tipo_persona ' +
                                ' WHERE nombre_usuario = ?', [nombreUser]);
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
			
				res.status(404).send({message :'El usuario ingresado no corresponde a un usuario registrado.'});				
			}
		
	}	



exports.useradd= async (req, res) =>{
    let variable = req.body;
    let tipo_user = variable.tipo_user;
    let result;
    let newUser = {};
    switch(tipo_user){
        case 3://persona cliente
                newUser = {
                    id_tipo_persona: tipo_user,
                    id_localidad: variable.localidad,
                    nombre: variable.nombre,
                    apellido: variable.apellido,
                    email: variable.email,
                    telefono: variable.tel,
                    estado: variable.estado,
                    activo:1
                    };
                    newUser.clave_usuario= await helpers.encryptPassword(clave);
                    result = await pool.query('INSERT INTO persona set ?', [newUser]);
                    res.status(200).send({result});
            
            break;
        case 4://persona paciente, update de cliente
            
                let clave_usuario= await helpers.encryptPassword(variable.dni);
                result = await pool.query("UPDATE persona SET id_tipo_persona="+tipo_user+",dni = '"+variable.dni+"', nombre_usuario = '"+variable.dni+"', clave_usuario='"+clave_usuario+"',estado='"+variable.estado+"' WHERE id_persona = "+variable.id_persona+"");
                res.status(200).send({result});
            break;
        default://persona profesional o admin
                newUser = {
                    id_tipo_persona: tipo_user,
                    id_localidad: variable.localidad,
                    dni: variable.dni,
                    nombre: variable.nombre,
                    apellido: variable.apellido,
                    nombre_usuario: variable.dni,
                    clave_usuario: variable.dni,
                    email: variable.email,
                    telefono: variable.tel,
                    activo:1
                    };
                    newUser.clave_usuario= await helpers.encryptPassword(clave_usuario);
                    result = await pool.query('INSERT INTO persona set ?', [newUser]);
                    res.status(200).send({result});
          
    }
   
}
exports.leousuario= function(req,res){
    let body = req.body;
    console.log(Object.values(body) +"entra");
    if(body != null){
        res.json({
            ok:true,
            usuario:body
        });
       
    }
    else{
        return res.status(400).json({
            ok:false
            
        }); 
    }
}

exports.updateUser = async (req, res) =>{
    let datos = req.body;
    let clave_usuario= await helpers.encryptPassword(datos.clave);
    let result = await pool.query("UPDATE persona SET dni = '" 
                                +datos.dni+"',nombre = '"
                                +datos.nombre+"',apellido = '"
                                +datos.apellido+"', nombre_usuario = '"
                                +datos.usuario+"', clave_usuario='"
                                +clave_usuario+"',email='"
                                +datos.email+"',telefono='"
                                +datos.telefono+"' WHERE id_persona = "+datos.id_persona+"");
    res.status(200).send({result});
}