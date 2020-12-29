const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'TEST-4695914672902143-122819-5bd0160aa06e09dee9becd0a8de6aa83-169256828'
  }); 

  
  
  
exports.obtenerUrlDePago= async (req, res) =>{
    // Crea un objeto de preferencia
let preference = {
  items: [
    {
      title: 'Solicitud consulta',
      unit_price: req.body.precio,
      quantity: 1,
    }
  ]
};
const response = await mercadopago.preferences.create(preference) 
if(response){
    res.status(200).send(response);      
}
else{
    return res.status(400).json({
        ok:false           
    }); 
}
    
   
  } 
