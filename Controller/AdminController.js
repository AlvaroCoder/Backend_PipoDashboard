const connection = require('../Services/Connection');
const conn2Db = connection.getInstance();
const {ErrorResponse, SuccesResponse} = require('../Models/HttpResponse')
const error = new ErrorResponse();
const success = new SuccesResponse();
const bcrypt = require('bcrypt');
const comandos = require('../Models/ComandosSQL');
conn2Db.connect();

class AdminController{
    async validarExisteAdminId(idAdmin){
        try {
            const countIdAdmin = await conn2Db.conn.query(comandos.Admin.validarIdAdmin,[idAdmin]).then(([row,field])=>row[0].conteo)
            return countIdAdmin > 0
        } catch (err) {
            return error.getError(err);
        }
    }
    async guardarAdminUser(admin){
        try{
            const data2Send = admin.construirSQL();
            const rpta = await conn2Db.conn.query(comandos.Admin.crearAdmin,data2Send).then(([row,field])=>row.insertId);
            return success.getSuccess("Cliente N° "+rpta+" created successfully!");
        }catch(err){
            return error.getError(err)
        }
    }
    async traerIdAdminByUser(userAdmin){
        try {
            const admin = await conn2Db.conn.query(comandos.Admin.mostrarIdAdmin,[userAdmin]).then(([row,field])=>row[0]) || {};
            return success.getSuccess(admin.idAdmin)
        } catch (err) {
            console.log(err);
            return error.getError(err)
        }
    }
    async ingresarAdmin(usuario, contrasenna){
        try {
            // TODO: Agregar medidas de seguridad
            const adminJSON = await conn2Db.conn.query(comandos.Admin.adminHashContraUser,[usuario]).then(([row,field])=>row[0] || []);
            if (!adminJSON) return error.getError("Usuario no existe");
            const hashCompare = await bcrypt.compare(contrasenna, adminJSON.contrasenna_hash);
            if (!hashCompare) return error.getError("Contraseña incorrecta");
            const admin = await conn2Db.conn.query(comandos.Admin.traerDataAdmin,[usuario]).then(([row,field])=>row[0])
            return admin;
        } catch (err) {
            return error.getError(err)
        }
    }
    async guardarCredentials(idAdmin,credentials){
        try {  
            const {ruta, token} = credentials;
            await conn2Db.conn.execute(comandos.Admin.guardarCredentials,[idAdmin, ruta, token]).then(([row,field])=>row.inserId);
            return success.getSuccess("Credentials created !")
        } catch (err) {
            return error.getError(err);
        }
    }
    async consultarDocumentoNubefact(idAdmin, tipoDocumento, serieDocumento, numeroDocumento){
        try {
            const credentials = await conn2Db.conn.query(comandos.Admin.traerCredentials,[idAdmin]).then(([row,field])=>row[0]);
            const {ruta, token} = credentials;
            const headers2Send = {
                'Authorization':'Token token="'+token+'"',
                'Content-Type' : 'application/json'
            }
            const json2Send = {
                "operacion":"consultar_comprobante",
                "tipo_de_comprobante":tipoDocumento,
                "serie":serieDocumento,
                "numero":numeroDocumento
            }
            const response = fetch(ruta,{
                method : 'POST',
                headers : headers2Send,
                body : JSON.stringify(json2Send)
            });
            const jsonRespond =await (await response).json();
            return success.getSuccess(jsonRespond)
        } catch (err) {
            return error.getError(err);
        }
    }
    async actualizarDetalleComprobante(idCredential, detalle){
        try {
            const {serieFactura, serieBoleta, serieCredito, numeroFactura, numeroBoleta, numeroCredito} = detalle;
            await conn2Db.conn.execute(comandos.Admin.actualizarDetalleComp, [serieFactura, serieBoleta, serieCredito, numeroFactura, numeroBoleta, numeroCredito, idCredential]).then(([row,field])=>row.inserId);
            return success.getSuccess("Actualizado Correctamente!");
        } catch (err) {
            return error.getError(err);
        }
    }
    async guardarComprobante(idAdmin, credentials){
        try {
            const detalleComprobante = await conn2Db.conn.query(comandos.Admin.traerDetallesComp,[idAdmin]).then(([row,field])=>row[0])
            const {tipoComprobante,idCliente} = credentials;
            let serieComprobante, numeroComprobante;
            switch(tipoComprobante){
                case 1: 
                    serieComprobante = detalleComprobante.serieFactura;
                    numeroComprobante = detalleComprobante.numeroFactura;
                    break;
                case 2:
                    serieComprobante = detalleComprobante.serieBoleta;
                    numeroComprobante = detalleComprobante.numeroBoleta;
                    break;
                case 3:
                    serieComprobante = detalleComprobante.serieCredito;
                    numeroComprobante = detalleComprobante.numeroCredito;
                    break;
            }
            const clienteJSONDb = await conn2Db.conn.query(comandos.Cliente.mostrarClientePorId, [idCliente]).then(([row,field])=>row[0]) || [];                
            const lenTipoDocumento = String(clienteJSONDb.documento).length
            const tipoDocumento = lenTipoDocumento  === 8 ? 1 : lenTipoDocumento === 11 ? 6 : "-"
            const clienteNumeroDoc = clienteJSONDb.documento || "-";
            const clienteNombre = clienteJSONDb.nombre || "VARIOS";
            const clienteDireccion = clienteJSONDb.direccion || "";
            const clienteEmail = clienteJSONDb.email || ""

            const credentials = await conn2Db.conn.query(comandos.Admin.traerCredentials,[idAdmin]).then(([row,field])=>row[0]);
            const {ruta,token} = credentials;
            const headers2Send = {
                'Authorization':'Token token="'+token+'"',
                'Content-Type' : 'application/json'
            }
            const jsonBody2Send = {
                "operacion":"generar_comprobante",
                "tipo_de_comprobante":tipoComprobante,
                "serie":serieComprobante,
                "numero":numeroComprobante+1,
                "sunat_transaction":1,
                "cliente_tipo_de_documento":tipoDocumento,
                "cliente_numero_de_documento":String(clienteNumeroDoc),
                "cliente_denominacion": clienteNombre,
                "cliente_direccion": clienteDireccion,
                "cliente_email": clienteEmail,
                "cliente_email_1":"",
                "cliente_email_2":"",
                "fecha_de_emision":""
            }

        } catch (err) {
            return error.getError(err);  
        }
    }
}
module.exports = AdminController;

