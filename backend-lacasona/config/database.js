const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('./init');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFESED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection)connection.release();
    console.log('DB is connected');
    return;

});
//convirtiendo a promesas lo que antes era por callback
pool.query = promisify(pool.query);

module.exports = pool;