const mercadopago = require('mercadopago');
const axios = require('axios');

mercadopago.configure({
    access_token: 'TEST-4695914672902143-122819-5bd0160aa06e09dee9becd0a8de6aa83-169256828'
  });
  
  
  
exports.obtenerUrlDePago= async (req, res) =>{
    let idDelUsuario = req.body.email;
    // Crea un objeto de preferencia
let preference = {
  items: [
    {
      title: 'Solicitud consulta',
      unit_price: req.body.precio,
      quantity: 1,
    }
  ],
  notification_url: 'http://ec2-52-14-22-254.us-east-2.compute.amazonaws.com:3000/mercadopago/notificacion/'+idDelUsuario
};
console.log(preference);
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



  exports.confirmarPago = (req, res, next) => {
    confirmarPago(req.body, req.params)
      .then(retorno => {
        res.status(200).json(retorno)
      })
      .catch(error => {
        throw new Error('Error al confirmar el pago')
      })
  } 
 async function confirmarPago(reqBody, reqParams) {
    /*
    si el topic es 'merchant_order', es porque nos llegó una orden de pago, 
    eso no nos interesa de momento, así que salimos y esperamos 
    a que llegue el pago en cuestión
    */
    if (reqBody.topic == 'merchant_order') return true
  
    const idDelUsuario = reqParams.idDelUsuario   //el que colocamos en la notification_url del objeto preference
    //const idDelProducto = reqParams.idDelProducto //IDEM
  
    const paymentId = reqBody.data.id //identifación del pago
  
    try {
  
      const paymentInfo = await obtenerInfoDePago(paymentId)
      if (!paymentInfo) return true   //si no hay información del pago, salimos
  
      const paymentStatus = paymentInfo.status
      console.log(paymentInfo);
      console.log('Estado del Pago:', paymentStatus)
  
      if (paymentStatus !== 'approved') return true   //si el pago no está aprobado salimos
      //addConsulta
      /*
      en este momento sabemos que el pago fue aprobado
      que el usuario con el id indicado es el que originó la compra
      y que el producto con el id indicado es el que efectivamente se compró
      
      acá es donde hacés lo que tengas que hacer en la base de datos
      como asignarle el producto al curso
      crear entradas en tu base de contabilidad, etc.
      */
  
      return true
    }
    catch (error) {
      throw error
    }
  }
  
  
  //con la id del pago, obtenemos el estado para ver si está aprobado o no:
  async function obtenerInfoDePago(paymentId) {
    try {
  
      const response = await axios.get('https://api.mercadopago.com/v1/payments/'+paymentId, {
        params: {
          access_token: 'TEST-4695914672902143-122819-5bd0160aa06e09dee9becd0a8de6aa83-169256828',
          status: 'approved',
          offset: 0,
          limit: 10,
        }
      })
  
      return response.data
  
    } catch (error) {
      console.log('error al obtener información de pago:', error)
      return true
    }
  }   
 