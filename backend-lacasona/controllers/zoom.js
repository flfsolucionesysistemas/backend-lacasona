const jwt = require ('jsonwebtoken'); // enlace del paquete npm aquí
const axios = require('axios');
const pool = require('../config/database');


exports.addMeeting = async(req,res)=>{
    const secret='s1AMbnlgCpMJEFWxN1IMKOfymMMVn2KBgp25';
    const token = jwt.sign({ 
        "iss": 'Ke3O5MSzTEiIoPV6ywnUHA',
        "exp": 1496091964000
    }, secret);

    const header= {
        'content-type': 'application/json', 
        Authorization: `Bearer ${token}`
    } 
    
let idUser;

profesional = await pool.query ('SELECT * FROM persona WHERE id_tipo_persona = 2  and id_persona = ?',[req.params.id_persona] );
console.log('PROFESSS ',profesional[0]);

if (profesional[0].id_user_zoom == 'null'){
	console.log('ENTRO EN EL IF',profesional[0]);

    axios.post('https://api.zoom.us/v2/users',{
       "action": "custCreate",
        "user_info": {
            "email": profesional[0].email,
            "type": 1,
            "first_name": profesional[0].nombre,
            "last_name": profesional[0].apellido
        }
    },
    {
        headers: header
    })
    .then(function(result) {
		console.log('ENTRO',result.data);
		
        idUser=result.data.id;
        const profe = {
            id_user_zoom: idUser,
            id_persona: profesional[0].id_persona
        }
        updateProfesional = pool.query('UPDATE persona SET ? WHERE id_persona = ?',[profe,profe.id_persona])
    
        axios.post(`https://api.zoom.us/v2/users/${idUser}/meetings`,{
            topic: 'Demo Meeting 1',
            type: 2,
            //start_time: '2021-09-07 19:17:00',
            password: 'casona',
            agenda: 'This is the meeting description',
            settings: {
              host_video: false,
              participant_video: false,
              join_before_host: false,
              mute_upon_entry: true,
              use_pmi: false,
              approval_type: 0
            }
          },
          {
              headers: header
          })
            .then(function(result) {
                if(result.status==200 ){
                    data={
                        start_url: result.data.start_url,
                        join_url: result.data.join_url
                    }                    
                }
            })
            .catch(function(err) {
                console.log(err);
            });
        })
        .catch(function(err) {
        console.log(err);
        });
}
else{
    console.log('ENTRO EN EL else',profesional[0]);
	idUser = profesional[0].id_user_zoom;
    axios.post(`https://api.zoom.us/v2/users/${idUser}/meetings`,{
            topic: 'Meeting ',
            type: 2,
            //start_time: '2021-09-07 19:17:00',
            password: 'casona',
            agenda: 'This is the meeting description',
            settings: {
              host_video: false,
              participant_video: false,
              join_before_host: false,
              mute_upon_entry: true,
              use_pmi: false,
              approval_type: 0
            }
          },
          {
              headers: header
          })
            .then(function(result) {
                if(result.status == 201){
					
					/*
					console.log('se va');
					console.log(result.data.start_url);
					console.log(result.data.join_url);
					
					return res.status(200).json({
						start_url:result.data.start_url,
                        join_url:result.data.join_url,
					});
					*/
                   
				   data = {
                        start_url:result.data.start_url,
                        join_url:result.data.join_url,
                    }
					
                }
				//console.log('data ', data);
				//const myObjStr = JSON.stringify(data);
				//console.log('data json ', myObjStr);
				//console.log('data json join_url en zoom ', data.join_url);
				
				res.status(200).send(data);                                      
            })
            .catch(function(err){
                console.log(err);
                res.status(400).json({msg:"error"});
            });            
    }

}
