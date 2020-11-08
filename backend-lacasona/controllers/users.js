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
    let variable = req.body;
    let tipo_user = variable.id_tipo_persona;
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
                    telefono: variable.telefono,
                    estado: variable.estado,
                    activo:1
                    };
                    //newUser.clave_usuario= await helpers.encryptPassword(clave);
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
                    telefono: variable.telefono,
                    activo:1
                    };
                    newUser.clave_usuario= await helpers.encryptPassword(variable.dni);
                    result = await pool.query('INSERT INTO persona set ?', [newUser]);
                    res.status(200).send({result});
          
    }
   
}

exports.updateUser = async (req, res) =>{
    let datos = req.body;
   /*updateUser = {
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
        };*/
    let clave_usuario= await helpers.encryptPassword(datos.clave);
    let result = await pool.query("UPDATE persona SET dni = '"+datos.dni+"',nombre = '"+datos.nombre+"',apellido = '"+datos.apellido+"', nombre_usuario = '"+datos.nombre_usuario+"', clave_usuario='"+clave_usuario+"',email='"+datos.email+"',telefono='"+datos.telefono+"' WHERE id_persona = "+datos.id_persona+"");
    res.status(200).send({result});
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
        return res.status(400).json({
            ok:false
            
        }); 
    }
}
exports.addHC = async (req, res)=>{
    let datos = req.body;
    
    let clave_usuario= await helpers.encryptPassword(datos.clave);
    let result = await pool.query("UPDATE persona SET dni = '"+datos.dni+"',nombre = '"+datos.nombre+"',apellido = '"+datos.apellido+"', nombre_usuario = '"+datos.usuario+"', clave_usuario='"+clave_usuario+"',email='"+datos.email+"',telefono='"+datos.telefono+"' WHERE id_persona = "+datos.id_persona+"");
    res.status(200).send({result});
    let codigo_hc;
}

