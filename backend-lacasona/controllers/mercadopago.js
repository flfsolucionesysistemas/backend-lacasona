const mercadopago = require('mercadopago');
const axios = require('axios');
const pool = require('../config/database');

mercadopago.configure({
    //access_token:'APP_USR-4695914672902143-123020-6e36dda61188fc87b3d661d04aeb724e-169256828'
    access_token: 'TEST-4270581017673819-123020-8674ab1ab7b0e591e0605c04da95e07a-155012162'
  });
  
  
  
exports.obtenerUrlDePago= async (req, res) =>{
    let usuario = req.body;
    // Crea un objeto de preferencia
let preference = {
  items: [
    {
      title: 'Solicitud consulta',
      unit_price: usuario.costo_entrevista,
      quantity: 1,
    }
  ],
  back_urls: {
    success: 'http://lacasonaweb-front.dyndnss.net/',
    failure: 'http://lacasonaweb-front.dyndnss.net/',
    pending: 'http://lacasonaweb-front.dyndnss.net/'
  },
  notification_url: 'http://ec2-52-14-22-254.us-east-2.compute.amazonaws.com:3000/mercadopago/notificacion/'+usuario.nombre+'/'+usuario.apellido+'/'+usuario.email+'/'+usuario.telefono+'/'+usuario.id_localidad+'/'+usuario.id_turno+'/'+usuario.costo_entrevista
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
  
    const nombreusuario = reqParams.nombre   //el que colocamos en la notification_url del objeto preference
    //const idDelProducto = reqParams.idDelProducto //IDEM
    console.log('usuario   ',nombreusuario);
    const paymentId = reqBody.data.id //identifación del pago
  
    try {
  
      const paymentInfo = await obtenerInfoDePago(paymentId)
      if (!paymentInfo) return true   //si no hay información del pago, salimos
  
      const paymentStatus = paymentInfo.status
      console.log('Id del pago: ',paymentInfo.id);
      console.log('Estado del Pago:', paymentStatus)
  
      if (paymentStatus !== 'approved') return true   //si el pago no está aprobado salimos
      console.log("entra");
      //addConsulta
      let pago = {
        fecha: paymentInfo.date_created,
        total: paymentInfo.transaction_details.net_received_amount,
        estado: "aprobado",
        pago_tratamiento: 0,
        id_mercadopago: paymentInfo.id,
        estado_mercadopago: paymentStatus,
        nombre:reqParams.nombre,
        apellido:reqParams.apellido,
        email:reqParams.email,
        telefono:reqParams.telefono,
        id_localidad:reqParams.id_localidad,
        id_turno:reqParams.id_turno,
        costo_entrevista:reqParams.costo_entrevista
      }
      
      const addPago = await axios({
        url: 'http://localhost:3000/global/add/',
        method: 'post',
        data: pago
      });
       /*const addConsulta = await axios({
        url: 'http://localhost:3000/consulta/add/',
        method: 'post',
        data: consulta
      });
      console.log(addConsulta);
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
           // access_token:'APP_USR-4695914672902143-123020-6e36dda61188fc87b3d661d04aeb724e-169256828',
          access_token: 'TEST-4270581017673819-123020-8674ab1ab7b0e591e0605c04da95e07a-155012162',
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


  //gestion de pago de tratamiento
  exports.obtenerUrlDePagoTratamiento= async (req, res) =>{
    let data = req.body;
    // Crea un objeto de preferencia
let preference = {
  items: [
    {
      title: 'PAGO MENSUAL DE TRATAMIENTO',
      unit_price: data.costo_mensual,
      quantity: 1,
    }
  ],
  back_urls: {
    success: 'http://lacasonaweb-front.dyndnss.net/#/pago',
    failure: 'http://lacasonaweb-front.dyndnss.net/#/pago',
    pending: 'http://lacasonaweb-front.dyndnss.net/#pago'
  },
  notification_url: 'http://ec2-52-14-22-254.us-east-2.compute.amazonaws.com:3000/mercadopago/notificacionTratamiento/'+data.id_hc+'/'+data.id_cupon
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


exports.confirmarPagoTratamiento = (req, res, next) => {
  confirmarPagoTratamiento(req.body, req.params)
    .then(retorno => {
      res.status(200).json(retorno)
    })
    .catch(error => {
      throw new Error('Error al confirmar el pago')
    })
} 
async function confirmarPagoTratamiento(reqBody, reqParams) {
  /*
  si el topic es 'merchant_order', es porque nos llegó una orden de pago, 
  eso no nos interesa de momento, así que salimos y esperamos 
  a que llegue el pago en cuestión
  */
  if (reqBody.topic == 'merchant_order') return true

  const id_hc = reqParams.id_hc   //el que colocamos en la notification_url del objeto preference
  //const idDelProducto = reqParams.idDelProducto //IDEM
  console.log('hc   ',id_hc);
  const paymentId = reqBody.data.id //identifación del pago

  try {

    const paymentInfo = await obtenerInfoDePagoTratamiento(paymentId)
    if (!paymentInfo) return true   //si no hay información del pago, salimos

    const paymentStatus = paymentInfo.status
    console.log('Id del pago: ',paymentInfo.id);
    console.log('Estado del Pago:', paymentStatus)

    if (paymentStatus !== 'approved') return true   //si el pago no está aprobado salimos
    console.log("entra");
    //addConsulta
    let pago = {
      fecha: paymentInfo.date_created,
      total: paymentInfo.transaction_details.net_received_amount,
      estado: "aprobado",
      pago_tratamiento: 1,
      id_mercadopago: paymentInfo.id,
      estado_mercadopago: paymentStatus,
      id_hc:reqParams.id_hc,
      id_cupon:reqParams.id_cupon
    }
    
    const addPago = await axios({
      url: 'http://localhost:3000/global/add/',
      method: 'post',
      data: pago
    });
    
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
async function obtenerInfoDePagoTratamiento(paymentId) {
  try {

    const response = await axios.get('https://api.mercadopago.com/v1/payments/'+paymentId, {
      params: {
         // access_token:'APP_USR-4695914672902143-123020-6e36dda61188fc87b3d661d04aeb724e-169256828',
        access_token: 'TEST-4270581017673819-123020-8674ab1ab7b0e591e0605c04da95e07a-155012162',
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


//Seccion cobranzas
// DESDE ESTE METODO SE OBTIENEN CUPONES PAGOS O NO PAGOS
exports.getCuponesPacientes = async (req, res)=>{
  let id_paciente = req.params.id_paciente;
  let body = await pool.query ('SELECT * FROM cupon as c '+
      'INNER JOIN hc_tratamiento as hct on c.id_hc_tratamiento=hct.id_hc_tratamiento '+
      'INNER JOIN historia_clinica as hc on hct.id_hc= hc.id_historia_clinica WHERE hc.id_persona_paciente='+id_paciente);
		
    if(body != null){
        res.status(200).send(body);      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
}
//METODO PARA OBTENER TODOS LOS PAGOS QUE SE EFECTUARON DEPENDIENDO DEL TIPO
exports.getCuponTipo = async(req, res)=>{
  let tipo = req.params.tipo;
  if(tipo==0){
    let body = await pool.query ('SELECT * FROM pago as p '+
      'INNER JOIN entrevista as e on e.id_pago=p.id_pago '+
      'INNER JOIN turno as t on t.id_tipo_turno=e.id_entrevista WHERE p.pago_tratamiento='+tipo);
		
    if(body != null){
        res.status(200).send(body);      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
  }
  else{
    
    let body = await pool.query ('SELECT * FROM cupon as c '+
      'INNER JOIN hc_tratamiento as hct on c.id_hc_tratamiento=hct.id_hc_tratamiento '+
      'INNER JOIN historia_clinica as hc on hct.id_hc= hc.id_historia_clinica order by c.id_cupon');
		
    if(body != null){
        res.status(200).send(body);      
    }
    else{
        return res.status(400).json({
            ok:false           
        }); 
    }
  }    
  
}
 