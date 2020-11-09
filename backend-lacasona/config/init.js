let config = {
    port:3000,
    database:{
        host: 'localhost',
        user: 'root',
        password:'USrrh7H6fb',
        database:'la_casona_web'
    },
    /*database:{
        host: 'localhost',
        user: 'root',
        password:'',
        database:'la_casona_web'
    },*/
    session:{
        secretPass:'lacasonasession',
        maxAge: 123
    },
    
}
module.exports = config
