const connection = require('../Services/Connection');
const conn2Db = connection.getInstance();
const {ErrorResponse, SuccesResponse} = require('../Models/HttpResponse')
const error = new ErrorResponse();
const success = new SuccesResponse();
const {ConstructorCliente} = require('../Models/ModelPersona');
const comandos = require('../Models/ComandosSQL');
conn2Db.connect();

class ClienteController{
    async buscarClienteSunat(documento){
        try {
            if (String(documento).length == 8) {
                const URL_DNI = comandos.SUNAT.urlDNI+documento+"?token="+comandos.SUNAT.token;
    
                const clienteSunat = await fetch(URL_DNI,{method : 'GET'})
                const jsonClienteSunat = await clienteSunat.json()
                
                const cliente = new ConstructorCliente()
                .setDocumento(String(documento))
                .setApellido(`${jsonClienteSunat.apellidoPaterno} ${jsonClienteSunat.apellidoMaterno}`)
                .setNombre(jsonClienteSunat.nombres)
                .construir();
                
                return success.getSuccess(cliente);
            }
            if (String(documento).length==11) {
                const URL_RUC = comandos.SUNAT.urlRuc+documento+"?token="+comandos.SUNAT.token;
                
                const clienteSunat = await fetch(URL_RUC,{method :'GET'})
                const jsonClienteSunat = await clienteSunat.json();

                const cliente = new ConstructorCliente()
                .setRazonSocial(jsonClienteSunat.razonSocial)
                .setDocumento(String(documento))
                .construir();
                
                return success.getSuccess(cliente);
            }
        } catch (err) {
            return error.getError(err)
        }
    }
    async buscarClienteId(idCliente){
        try {
            const clientes = await conn2Db.conn.query(comandos.Cliente.mostrarClientePorId, [idCliente]).then((res)=>res[0][0]);
            return success.getSuccess(clientes);
        } catch (err) {
            return error.getError(err);
        }
    }
    async buscarClienteNombre(nombreCliente){
        try {
            const clients = await conn2Db.conn.query(comandos.Cliente.mostrarClientes).then(([row,field])=>row) || [];
            const cliente = clients.filter((cliente)=>{
                const {nombre} = cliente;
                return nombre.toUpperCase().includes(nombreCliente.toUpperCase());
            });
            return success.getSuccess(cliente);
        } catch (err) {
            return error.getError(err);
        }
    }
    async buscarClienteApellido(apellidoCliente){
        try {
            const clients = await conn2Db.conn.query(comandos.Cliente.mostrarClientes).then(([row,field])=>row) || [];
            const cliente = clients.filter((cliente)=>{
                const {apellido} = cliente;
                return apellido.toUpperCase().includes(apellidoCliente.toUpperCase())
            });
            return success.getSuccess(cliente);
        } catch (err) {
            
        }
    }
    async mostrarClientes(idAdmin,maxData){
        try {
            const clients = await conn2Db.conn.query(comandos.Cliente.mostrarClientes, [idAdmin,maxData]).then(([row,field])=>row)
            const responseClients = clients.map((cliente)=>{
                const clienteObject = new ConstructorCliente()
                .setIdCliente(cliente.idCliente)
                .setRazonSocial(cliente.nombre)
                .setApellido(cliente.apellido)
                .setDocumento(cliente.documento)
                .setFechaCumpleannos(cliente.fechaCumpleannos)
                .setTelefono(cliente.telefono)
                .setDireccion(cliente.direccion)
                .setGenero(cliente.genero)
                .construirJSON();
                return clienteObject;
            })
            return success.getSuccess(responseClients);
        } catch (err) {
            return error.getError(err)
        }
    }
    async eliminarCliente(idCliente){
        try{
            const idPersona = await conn2Db.conn.query(comandos.Persona.getId, [idCliente]).then(([row,field])=>{
                return row[0].idPersona
            });
            await conn2Db.conn.execute(comandos.Persona.eliminar, [idPersona])
            await conn2Db.conn.execute(comandos.Cliente.eliminar, [idCliente])
            return success.getSuccess("Deleted Succesfully!");
        }catch(err){
            return error.getError(err);
        }
    }
    async guardarCliente(cliente){
        try {
           // Validamos si existe alguna persona repetida
            const doc = cliente.documento;
            const repeticionesPersona = await conn2Db.conn.query(comandos.Cliente.personarepetida, [doc]).then(([row,field])=>row[0].repeticiones)
            if (repeticionesPersona > 0) return error.getError("Este cliente ya existe");
           
            // Primero creamos a la persona
            const clienteJSON = new ConstructorCliente()
            .setDocumento(cliente.documento)
            .setApellido(cliente.apellido.toUpperCase())
            .setDetalle(cliente.detalle)
            .setRazonSocial(cliente.razSocial.toUpperCase())
            .setDireccion(cliente.direccion)
            .setTelefono(cliente.telefono)
            .setGenero(cliente.genero)
            .setFechaCumpleannos(cliente.fechaCumpleannos)
            .setIdAdmin(cliente.idAdmin);

            const jsonPersona = clienteJSON.construirSQLPersona();
            const idPersona = await conn2Db.conn.execute(comandos.Persona.crear, jsonPersona).then(([row,field])=>row.insertId)
            const jsonCliente = clienteJSON.construirSQLCliente(idPersona);
            const rowInsert = await conn2Db.conn.execute(comandos.Cliente.crear,jsonCliente).then(([row,field])=>row.insertId)
            return success.getSuccess("Cliente N° "+rowInsert+" created Succesfully!")
        } catch (err) {
            return error.getError(err)        
        }
    }
    async actualizarCliente(idCliente, cliente){
        try {
            await conn2Db.conn.execute(comandos.Persona.actualizar, [cliente.nombre, cliente.apellido, cliente.telefono, cliente.documento, cliente.genero, cliente.direccion, idCliente])
            await conn2Db.conn.execute(comandos.Cliente.actualizar,[cliente.correo, idCliente])
            return success.getSuccess("Update Successfully! ")
        } catch (err) {
            return error.getError(err)
        }
    }
}

module.exports = ClienteController;