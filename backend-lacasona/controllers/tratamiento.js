const pool = require('../config/database');
const axios = require('axios');

exports.add=async(req,res)=>{
    let datos = req.body;       
        await pool.query('INSERT INTO tratamiento set ?', [datos], function(err, sql){
            if(err){
                console.log(err);
                res.status(400).json({
                    error: 'No se ha podido guardar el tratamiento'
                });
            }
            else{
                res.status(200).send({sql});
            }
        });
          
}