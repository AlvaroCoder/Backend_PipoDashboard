const pool = require('../mysql/mysql_querys');
const CREATE_PROVEEDOR = "INSERT INTO "
const GET_PROVEEDOR ="SELECT razon_social, nombre, telefono FROM proveedor;"
const Proveedor = {
    GetProveedores : async function () {
        try{
            return await pool.query(GET_PROVEEDOR).then((row,field)=>{
                return row[0]
            })
        }catch(e){
            throw e
        }
    }
}
module.exports = Proveedor;