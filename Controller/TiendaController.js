const connection = require('../Services/Connection');
const { ErrorResponse, SuccesResponse } = require('../Models/HttpResponse');
const conn2Db = connection.getInstance();
const error = new ErrorResponse();
const success = new SuccesResponse();
const comandos = require('../Models/ComandosSQL');
const ConstructorTienda = require('../Models/ModelTienda');
const { ValidateHasEmptyFields } = require("../Services/ProductsService");
conn2Db.connect();
class TiendaController{
    async crearTienda(tienda){
        try {
            const hasEmpty = ValidateHasEmptyFields(tienda);
            if (hasEmpty) return error.getError("Data incompleta!");
            const {idAdmin, razSocial, direccion, nombre} = tienda;
            const tiendaObject = new ConstructorTienda()
            .setIdAdmin(idAdmin)
            .setRazSocial(razSocial)
            .setDireccion(direccion)
            .setNombre(nombre.toUpperCase())
            .construirSQL();
    
            const jsonTienda = await conn2Db.conn.execute(comandos.Admin.createStore, tiendaObject).then(([row,field])=>row.insertId);
            return success.getSuccess("Cliente N°"+jsonTienda+" created Successfully");
        } catch (err) {
            return error.getError(err)
        }

    }
    async uploadPhoto(){

    }
}
module.exports = TiendaController;