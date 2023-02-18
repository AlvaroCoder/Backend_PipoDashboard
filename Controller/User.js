const pool = require('../mysql/mysql_querys');

const VALIDATE_ADMIN = 'SELECT * FROM persona WHERE idpersona = (SELECT persona_idpersona FROM administrador WHERE usuario = ?);'
const VALIDATE_COSTUMER = "SELECT * FROM persona WHERE idpersona = (SELECT persona_idpersona FROM vendedor WHERE usuario = ?);"
async function ValidateUser(user) {
    console.log(user)
    const result_admin = await pool.query(VALIDATE_ADMIN,[user]).then(val=>val[0][0]) || []
    const result_costu = await pool.query(VALIDATE_COSTUMER,[user]).then(val=>val[0][0]) || []

    if (result_admin[0]) {
        return 1;
    }
    if (result_costu[0]) {
        return 2;
    }
}
module.exports = {ValidateUser}