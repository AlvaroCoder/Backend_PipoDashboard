const pool = require('../mysql/mysql_querys');

const CREATE_ADMIN = "INSERT INTO administrador (idadministrador, usuario, contrasenna, contrasenna_hash, persona_idpersona) VALUES (?,?,?,?,?);"
const CREATE_PERSON = "INSERT INTO persona (nombre, apellido, telefono, razon_social, esAdmin) VALUES (?,?,?,?,?);"
const GET_ADMIN_HASH_BY_USER = "SELECT  contrasenna_hash FROM administrador WHERE usuario = ?;"
const GET_ADMIN = "SELECT idadministrador, usuario, contrasenna, contrasenna_hash FROM administrador WHERE usuario = ?;"

const Admin = {
    message : {message : '', status : 202, error : false},
    Create : async function (data) {
        const message = {error : false}
        const {idadministrador, usuario, contrasenna, contrasenna_hash, nombre, apellido, telefono, razon_social} = data
        const id_persona = await pool.execute(CREATE_PERSON, [nombre || '', apellido || '', telefono || 0, razon_social || 0, 1]).then(([row, field])=>{
            return row.insertId
        }).catch((err)=>{
            message.status = 404
            message.message = `Error : ${err}`
            message.error = true
        });
        const create_admin = await pool.execute(CREATE_ADMIN, [idadministrador, usuario, contrasenna, contrasenna_hash, id_persona]).then(([row, field])=>{
            return row.affectedRows
        }).catch((err)=>{
            message.status = 404
            message.message = `Error : ${err}`
            message.error = true
        })
        if (!message.error) {
            message.status = 200
            message.error = false
            message.message = `Administrador correctamente creado : ${create_admin}`
        }
        return message;
    },
    GetPassHashByUser : async function (usuario = String) {
        await pool.query(GET_ADMIN_HASH_BY_USER, [usuario])
        .then(val=>{
            this.message.message = val[0]
        }).catch((err)=>{
            this.message.error = true,
            this.message.status = 404,
            this.message.message = err
        });
        return this.message;
    },
    GetAdmin : async function (user) {
        await pool.query(GET_ADMIN, [user])
        .then(val=>{
            this.message.message = val[0]
        }).catch(err=>{
            this.message.error = true,
            this.message.status = 500,
            this.message.message = err
        })
        return this.message;
    },
    Delete : async function (idadmin = String) {
        
    }
}
module.exports = Admin