const bcrypt = require('bcryptjs');

const helpers = {};
helpers.encryptPassword = async (password)=> {
    const salt = await bcrypt.genSalt(10);
    const clave = await bcrypt.hash(password, salt);
    return clave;
}

helpers.marchPassword = async (password, passwordDB)=>{
    
    return await bcrypt.compare(password,passwordDB);
}

module.exports=helpers;