const pool = require('../mysql/mysql_querys');

const GET_CLIENTS_GENERAL = process.env.GET_CLIENTS_GENERAL
const GET_CLIENT_BY_ID = process.env.GET_CLIENT_BY_ID
const GET_IDPERSONA = process.env.GET_IDPERSONA
const GET_REP_PERSONA = process.env.GET_REP_PERSONA

const UPDATE_PERSON = process.env.UPDATE_PERSON;
const UPDATE_CLIENT = process.env.UPDATE_CLIENT;
const UPDATE_NAME_PERSON = process.env.UPDATE_NAME_PERSON;
const UPDATE_TEL_PERSON = process.env.UPDATE_TEL_PERSON;
const UPDATE_LAST_NAME_PERSON = process.env.UPDATE_LAST_NAME_PERSON;
const UPDATE_RAZON_SOCIAL = process.env.UPDATE_RAZON_SOCIAL;
const UPDATE_EMAIL = process.env.UPDATE_EMAIL;
const UPDATE_SALDO = process.env.UPDATE_SALDO;

const CREATE_PERSON = process.env.CREATE_PERSON
const CREATE_CLIENT = process.env.CREATE_CLIENT

const DELETE_PERSON = process.env.DELETE_PERSON
const DELETE_CLIENT = process.env.DELETE_CLIENT

// TODO: Terminar de crear los metodos de UPDATE 

const Clients ={
    Cliente_idCliente : null,
    message : {error : false, status : 202, message : ''},
    Create : async function (body = Object) {
        try {
            const {idcliente, nombre, apellido, fecha_cumpleannos, fecha_creacion, telefono, nro_doc, credito_limite, correo,genero, vip,duracion_credit, estrellas,detalle_cliente, direccion} = body;
            const id_persona = await pool.execute(CREATE_PERSON, [nombre || '', apellido || '', fecha_cumpleannos || fecha_creacion, fecha_creacion || '', telefono || 0, nro_doc || 0, genero || '', 0, direccion || '']).then(([row,field])=>{
                return row.insertId;
            })
            await pool.execute(CREATE_CLIENT,[idcliente,id_persona, credito_limite||200, detalle_cliente||'',credito_limite || 200,correo||'',duracion_credit||'30d', vip||0,estrellas||5]);
            this.message.message = "Client Created Succesfully"
        } catch (error) {
            console.log(error);
            this.message.error = true
            this.message.status = 500
            this.message.message = error
        }
    },
    GetClients : async function () {
        await pool.query(GET_CLIENTS_GENERAL)
        .then((row, fields)=>{
            this.message.message = row[0]
        }).catch((err)=>{
            this.message.error = true
            this.message.message  = err
            this.message.status = 404
        });
        return this.message;
    },
    GetImages : async function () {
        await pool.query()  
    },
    GetClientGeneral : async function () {
        try {
            await pool.query(GET_CLIENTS_GENERAL)
            .then((row,field)=>{
                this.message.message = row[0]
            }).catch(err=>{
                this.message.error = true
                this.message.message  = err
                this.message.status = 404    
            });
            return this.message
        } catch (error) {
            
        }
    },
    GetRepPersona : async function (doc) {
        await pool.query(GET_REP_PERSONA, [doc]).then((row, field)=>{
            this.message.error = false
            this.message.message = row[0][0].repeticiones
            this.message.status = 202
        })
        return this.message
    },
    GetClientBytId : async function (idCliente) {
        await pool.query(GET_CLIENT_BY_ID, [idCliente]).then((row, fields)=>{
            this.message.error = false
            this.message.message = row[0][0]
            this.message.status = 202
        }).catch((err)=>{
            this.message.error = true
            this.message.message = err
            this.message.status = 404
        });
        return this.message;
    },
    UpdateClient : async function (body=Object) {
        const {nombre, apellido, telefono, nro_doc, genero, direccion, idcliente, correo } = body;
      try{
        await pool.execute(UPDATE_PERSON,[nombre, apellido, telefono, nro_doc, genero, direccion, idcliente])
        await pool.execute(UPDATE_CLIENT, [correo, idcliente])
      } catch (error){
        this.message.error = true
        this.message.message = error
        this.message.status = 404
      } 
    },
    UpdateNombre : async function (idCliente = String , newNombre = String) {
        try {
            await pool.execute(UPDATE_NAME_PERSON,[newNombre, idCliente])
            .then((el)=>{
                this.message.message = `Update Successfully, ${el[0].affectedRows}`
            }).catch((err)=>{
                this.message.error = true
                this.message.message = err
                this.message.status = 404
            })
        } catch (error) {
            this.message.error = true
            this.message.message = error
            this.message.status = 404
        }
    },
    UpdateApellido : async function (idCliente = String, newApellido = String) {
        try {
            await pool.execute(UPDATE_LAST_NAME_PERSON, [newApellido, idCliente])
            .then(res=>{
                this.message.message = `Update Successfully, ${res[0].affectedRows}`
            }).catch(err=>{
                this.message.error = true
                this.message.message = err
                this.message.status = 404    
            })

        } catch (error) {
            this.message.error = true
            this.message.message = error
            this.message.status = 404
        }
    },
    UpdateTelephone : async function (idCliente = String, tel = Number) {
        try {
            await  pool.execute(UPDATE_TEL_PERSON, [tel, idCliente])
            .then((val)=>{
                this.message.message = `Update Successfully, ${val[0].info}`
            }).catch((err)=>{
                this.message.error = true
                this.message.message = err
                this.message.status = 404
            });
        } catch (error) {
            this.message.error = true
            this.message.message = error
            this.message.status = 404
        }
    },
    UpdateEmail : async function (idCliente = String, newEmail = String) {
        try {
            await pool.execute(UPDATE_EMAIL, [newEmail, idCliente])
            .then(res=>{
                this.message.message = `Update Successfully, ${res[0].affectedRows}`
            }).catch(err=>{
                this.message.error = true
                this.message.message = err
                this.message.status = 404
            })
        } catch (error) {
            this.message.error = true
            this.message.message = error
            this.message.status = 404            
        }
    },
    UpdateRazonSocial : async function (idCliente = String, newRazonSocial = String) {
        try {
            await pool.execute(UPDATE_RAZON_SOCIAL,[newRazonSocial, idCliente]).then(res=>{
                this.message.message = `Update Successfully, ${res[0].affectedRows}`
            }).catch(err=>{
                this.message.error = true
                this.message.message = err
                this.message.status = 404
            })
        } catch (error) {
            this.message.error = true
            this.message.message = error
            this.message.status = 404 
        }
    },
    UpdateSaldo : async function (idCliente = String, newSaldo = Number) {
        try {
            await pool.execute(UPDATE_SALDO,[newSaldo, idCliente])
            .then(res=>{
                this.message.message = `Updated Successfully, ${res[0].affectedRows}`
            }).catch(err=>{
                this.message.error = true
                this.message.message = err
                this.message.status = 404                
            });
        } catch (error) {
            this.message.error = true
            this.message.message = error
            this.message.status = 404 
        }
    },
    DeleteClient : async function (idCliente =  String) {
        try {
            const persona_idpersona = await pool.query(GET_IDPERSONA, [idCliente]).then(([row,field])=>{
                return row[0].persona_idpersona
            });
            await pool.execute(DELETE_PERSON,[persona_idpersona])
            await pool.execute(DELETE_CLIENT, [idCliente])

            this.message.message = "Deleted Succesfully"
        } catch (error) {
            this.message.error = true
            this.message.message = error
            this.message.status = 404
        }        
    }
}
module.exports = Clients;