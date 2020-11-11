const pool = require('../config/database');
const helpers = require('../config/helpers');
var ctrlUsuario = require('../controllers/users');

exports.addHC = async (req, res)=>{
    let datos = req.body;
    let id_persona_paciente = datos.id_persona;
    let id_persona_creacion = 2;
    console.log(datos);
    let clave_usuario= await helpers.encryptPassword(datos.dni);
        newUser = {
            id_tipo_persona: datos.id_tipo_persona,
            dni: datos.dni,
            nombre_usuario: datos.dni,
            clave_usuario: clave_usuario,
            estado: datos.estado,
            activo:1
        };
        try {    
            result = await pool.query('UPDATE persona SET ? WHERE id_persona = ?', [newUser, id_persona_paciente]);
            console.log({result});
        } catch(err) {
                    // If promise is rejected
            console.error(err);
        }
    /*try {
        ctrlUsuario.useradd(datos);
         console.log('Obtenido el resultado final:'+resul);
      } catch(error) {
        console.log(error);
      }
    //metodo update cliente
    ctrlUsuario.useradd(datos).then(res =>{
        console.log(res);
      }).catch(() => {
        console.log('Algo salió mal');
      });*/

    let codigo_hc = datos.id_provincia+"-"+datos.id_localidad+"-"+datos.dni.substr(-3)+"-"+id_persona_paciente;
    console.log(codigo_hc);
    let newHC = {
        id_persona_paciente: id_persona_paciente,
        id_persona_creacion: id_persona_creacion,
        numero_historia_clinica: codigo_hc,
        fecha_creacion: new Date()
    };
    result = await pool.query('INSERT INTO historia_clinica set ?', [newHC]);
    res.status(200).send({result});
    
}