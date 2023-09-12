const {ErrorResponse,SuccesResponse} = require('../Models/HttpResponse');
const ConnectionDatabase = require('../Services/Connection');
const conn2Db = ConnectionDatabase.getInstance();
const ComandosSQL = require('../Models/ComandosSQL');
const { ConstructorProveedor } = require('../Models/ModelPersona');

const error = new ErrorResponse(); 
const success = new SuccesResponse();
conn2Db.connect();

class ProveedorController{
    async existeProveedorDoc(documento){
        const existeProveedor = conn2Db.conn.query(ComandosSQL.Proveedor.existeProveedorDoc,[documento]).then(([row,field])=>row[0].conteo);
        return existeProveedor > 0;
    }
    async guardarProveedor(idAdmin,proveedor){
        try {
            const clienteJSON = new ConstructorProveedor()
            .setIdAdmin(idAdmin)
            .setDocumento(proveedor.documento)
            .setEmail(proveedor.email)
            .setRazSocial(proveedor.razSocial)
            .setTelefono(proveedor.telefono)
            .setDetalle(proveedor.detalle)
            .setDireccion(proveedor.direccion);
            
            const jsonPersona = clienteJSON.construirSQLPersona();
            const idPersona = await conn2Db.conn.execute(ComandosSQL.Persona.crear, jsonPersona).then(([row,field])=>row.insertId)
            const jsonProveedor = clienteJSON.construirSQLProveedor(idPersona);
            const rpta = await conn2Db.conn.execute(ComandosSQL.Proveedor.crear, jsonProveedor).then(([row,field])=>row.insertId).catch((e)=>console.log(e));
            return success.getSuccess("Proveedor N° "+rpta+" creado correctamente");   
        } catch (err) {
            return error.getError(err)
        }
    }   
    async traerProveedores(userAdmin,limitProveedores){
        try {
            let limiteProv = limitProveedores || 20;
            const idAdmin = await conn2Db.conn.query(ComandosSQL.Admin.mostrarIdAdmin,[userAdmin]).then(([row,field])=>row[0].idAdmin) || "";
            const proveedores = await conn2Db.conn.query(ComandosSQL.Proveedor.traerProveedores,[idAdmin, limiteProv]).then(([row,field])=>row);
            const responseProveedores = proveedores.map((proveedor)=>{
                return new ConstructorProveedor()
                .setRazSocial(proveedor.nombre)
                .setDocumento(proveedor.documento)
                .setDireccion(proveedor.direccion)
                .setFechaCreacion(proveedor.fechaCreacion)
                .setDetalle(proveedor.detalle)
                .setEmail(proveedor.email)
                .construirJSON();
            });
            return success.getSuccess(responseProveedores);
        } catch (err) {
            return error.getError(err);
        }
    }
}
module.exports = ProveedorController;