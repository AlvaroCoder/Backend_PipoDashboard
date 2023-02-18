const pool = require('../mysql/mysql_querys');
const GET_CLIENTS = "SELECT cliente.idcliente, persona.razon_social, persona.nombre, persona.apellido,persona.fecha_cumpleannos, cliente.ultimo_pago, cliente.duracion_credit, cliente.saldo, cliente.credito_limite, cliente.esVip,persona.genero,cliente.calificacion_idcalificacion, calificacion.nombre AS calificacion FROM persona, cliente, calificacion WHERE persona.idpersona = cliente.persona_idpersona AND cliente.calificacion_idcalificacion = calificacion.idcalificacion;"
const GET_CLIENT_BY_ID = "SELECT persona.nombre, persona.apellido, cliente.ultimo_pago, cliente.saldo, cliente.credito_limite FROM persona, cliente WHERE persona.idpersona = cliente.persona_idpersona AND cliente.idcliente = ?;"
const GET_CLIENT_BY_NOMBRE = "";
const UPDATE_NAME_PERSON = "UPDATE persona SET nombre = ? WHERE idpersona = (SELECT persona_idpersona FROM cliente WHERE idcliente = ?) ;"
const UPDATE_TEL_PERSON = "UPDATE persona SET telefono = ? WHERE idpersona = (SELECT persona_idpersona FROM cliente WHERE idcliente = ?) ;"
const Clients ={
    Cliente_idCliente : null,
    message : {error : false, status : 202, message : ''},
    Create : async function (body) {
        try {
            const {idcliente, nombre, apellido, fecha_cumpleannos, fecha_creacion, telefono, razon_social, credito_limite, email,genero, vip,duracion_credit, detalle_cliente} = body;
            const CREATE_PERSON = `INSERT INTO persona (nombre, apellido, fecha_cumpleannos, fecha_creacion, telefono, razon_social, genero) VALUES (?,?,?,?,?,?,?)`
            const CREATE_CLIENT = "INSERT INTO cliente (idcliente, persona_idpersona, credito_limite, detalle, email,calificacion_idcalificacion, duracion_credit, esVip) VALUES (?,?,?,?,?,?,?,?); "

            const id_persona = await pool.execute(CREATE_PERSON, [nombre, apellido, fecha_cumpleannos || null, fecha_creacion, telefono || 0, razon_social || 0, genero]).then(([row, field])=>{
                return row.insertId
            }).catch((err)=>{
                this.message.error = true
                this.message.message  = err
                this.message.status = 404
            });
            await pool.execute(CREATE_CLIENT, [idcliente, id_persona, credito_limite || 100, detalle_cliente,email, 1, duracion_credit || '15d', vip]).then(([row, field])=>{
                this.message.message = `AffectedRows : ${row.affectedRows}`
            }).catch((err)=>{
                this.message.error = true
                this.message.message  = err
                this.message.status = 404
            });
            return this.message;
        } catch (error) {
            console.log(new Error(error));
        }
        
    },
    GetClients : async function () {
        await pool.query(GET_CLIENTS)
        .then((row, fields)=>{
            this.message.message = row[0]
        }).catch((err)=>{
            this.message.error = true
            this.message.message  = err
            this.message.status = 404
        });
        return this.message;
    },
    GetClientBytId : async function (idCliente) {
        await pool.query(GET_CLIENT_BY_ID, [idCliente]).then((row, fields)=>{
            this.message.error = false
            this.message.message = row[0]
            this.message.status = 202
        }).catch((err)=>{
            this.message.error = true
            this.message.message = err
            this.message.status = 404
        });
        return this.message;
    },
    UpdateNombre : async function (idCliente = String , newNombre = String) {
        await pool.execute(UPDATE_NAME_PERSON,[newNombre, idCliente ])
        .then((el)=>{
            this.message.message = `AffectedRows : ${el[0].affectedRows}`
        }).catch((err)=>{
            this.message.error = true
            this.message.message = err
            this.message.status = 404
        })
        return this.message;
    },
    UpdateApellido : async function (idCliente = String, newApellido = String) {

    },
    UpdateTelephone : async function (idCliente = String, tel = Number) {
        await  pool.execute(UPDATE_TEL_PERSON, [tel, idCliente])
        .then((val)=>{
            this.message.message = `${val[0].info}`
        }).catch((err)=>{
            this.message.error = true
            this.message.message = err
            this.message.status = 404
        });
        return this.message;

    }
}
module.exports = Clients;