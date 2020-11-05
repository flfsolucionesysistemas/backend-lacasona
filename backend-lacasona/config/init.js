let config = {
    port:3000,
    database:{
        host: 'localhost',
        user: 'root',
        password:'everLAST*160',
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