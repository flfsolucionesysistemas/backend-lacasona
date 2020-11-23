const pool = require('../config/database');
const axios = require('axios');

exports.addHC = async (req, res)=>{
    let datos = req.body;
    let id_persona_paciente = datos.id_persona;
    let id_persona_creacion = 2;
    //utilizo metodo ya creado  
        axios.post('http://localhost:3000/users/add',{
            "id_persona": id_persona_paciente,
            "id_tipo_persona": 4,
            "dni": datos.dni,
            "estado": datos.estado
            
        })
        .then(function(res) {
          if(res.status==200 && Object.values(res.data)==1) {
            console.log("OK");
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    
    let codigo_hc = datos.id_provincia+"-"+datos.id_localidad+"-"+datos.dni.substr(-3)+"-"+id_persona_paciente;
    console.log(codigo_hc);
    let newHC = {
        id_persona_paciente: id_persona_paciente,
        id_persona_creacion: id_persona_creacion,
        numero_historia_clinica: codigo_hc,
        fecha_creacion: new Date()
    };
    await pool.query('INSERT INTO historia_clinica set ?', [newHC], function(err, result){
      if(err){
          res.status(400).json({
              error: 'No se ha podido guardar el paciente'
          });
      }
      else{
          console.log(result.insertId);
          return res.status(200).send({result});
      }
  });
    
}

