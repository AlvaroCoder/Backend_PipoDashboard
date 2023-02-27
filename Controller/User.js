const pool = require('../mysql/mysql_querys');

const VALIDATE_USER = 'SELECT esAdmin FROM persona WHERE idpersona = (SELECT persona_idpersona FROM administrador WHERE usuario = ?);'
async function ValidateUser(user) {
    return await pool.query(VALIDATE_USER,[user]).then(val=>{
        return val[0][0].esAdmin
    }) || []
}
module.exports = {ValidateUser}