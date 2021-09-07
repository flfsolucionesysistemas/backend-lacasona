const jwt = require ('jsonwebtoken'); // enlace del paquete npm aquí
const axios = require('axios');


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


axios.post('https://api.zoom.us/v2/users',{
       "action": "custCreate",
        "user_info": {
            "email": req.body.email,
            "type": 1,
            "first_name": req.body.nombre,
            "last_name": req.body.apellido
        }
    },
    {
        headers: header
    })
.then(function(res) {
    idUser=res.data.id;
    console.log('id:  '+idUser);
          axios.post(`https://api.zoom.us/v2/users/${idUser}/meetings`,{
            topic: 'Demo Meeting 1',
            type: 2,
            //start_time: '2021-09-07 19:17:00',
            password: 'Hey123',
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
      .then(function(res) {
          console.log(res);
      })
      .catch(function(err) {
        console.log(err);
      });
})
.catch(function(err) {
  console.log(err);
});
}
