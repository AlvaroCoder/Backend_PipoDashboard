const ConnectionDatabase = require('../Services/Connection');
const {ErrorResponse,SuccesResponse} = require('../Models/HttpResponse');
const conn2Db = ConnectionDatabase.getInstance();
const comandos = require('../Models/ComandosSQL');
const { ConstructorOrdenInventario, ConstructorProducto } = require('../Models/ModelProducto');
const ConstructorImagen = require('../Models/ModelImagen');

const error = new ErrorResponse(); 
const success = new SuccesResponse();
conn2Db.connect();

class ProductoController{
    async guardarOrden(order){
        try {
            const {idTienda,idAdmin,productos,idProveedor,estado} = order;
            const ordenesPrevias = await conn2Db.conn.query(comandos.Productos.ordenesPrevias,[idAdmin]).then(([row,field])=>row[0].ordenesPrevias);
            const ordenInventario = new ConstructorOrdenInventario()
            .setIdAdmin(idAdmin)
            .setIdTienda(idTienda)
            .setProductos(productos)
            .setIdProveedor(idProveedor)
            .setEstado(estado);
            const jsonOrdenInventario = ordenInventario.construirSQLOrden(ordenesPrevias);
            await conn2Db.conn.execute(comandos.Productos.crearOrden,jsonOrdenInventario).then(([row,field])=>row.insertId);
            productos.forEach(async (product) => {
                let idOrdenInventario = ordenInventario.idOrdenInventario;
                const {codigo, nombre, color, stock, precioUnitario, idMarca,marca, idImage, idTalla} = product;
                let idMarcaNew = idMarca;
                if (idMarca === 0) {
                    idMarcaNew = await conn2Db.conn.execute(comandos.Productos.crearMarca,[marca.nombre, marca.categoria]).then(([row,field])=>row.insertId);
                }

                const jsonProducto = new ConstructorProducto()
                .setIdAdmin(idAdmin)
                .setIdOrdenInventario(idOrdenInventario)
                .setCodigo(codigo)
                .setNombre(nombre)
                .setColor(color)
                .setStock(stock)
                .setPrecioUnitario(precioUnitario)
                .setIdImage(idImage)
                .setIdTalla(idTalla)
                .setIdMarca(idMarcaNew)
                .construirSQLProducto();

                await conn2Db.conn.execute(comandos.Productos.crear, jsonProducto).then(([row,field])=>row.insertId)
            });
            return success.getSuccess("Order created Successfully !")
        } catch (err) {
            return error.getError(err);
        }
    }
    async guardarProducto(producto,idImagen){
        try {
            const {idOrdenInventario, idMarca, idTalla,userAdmin, codigo, nombre, color, stock, precioUnitario, marca, talla} = producto;
            const idAdmin = await conn2Db.conn.query(comandos.Admin.mostrarIdAdmin,[userAdmin]).then(([row,field])=>row[0].idAdmin) || "";

            const jsonProducto = new ConstructorProducto()
            .setIdAdmin(idAdmin)
            .setIdOrdenInventario(idOrdenInventario)
            .setCodigo(codigo)
            .setColor(color)
            .setNombre(nombre)
            .setStock(parseInt(stock))
            .setPrecioUnitario(parseFloat(precioUnitario))
            .setIdMarca(idMarca)
            .setIdImage(idImagen)
            .setIdTalla(idTalla)
            .construirSQLProducto();

            const insertIdProduct = await conn2Db.conn.execute(comandos.Productos.crear,jsonProducto).then((res)=>res[0].insertId);
            return success.getSuccess("Created Successfully! "+insertIdProduct)
        } catch (err) {
            console.log(err);
            return error.getError(err);
        }
    }
    async traerOrdenes(LimitOrders, userAdmin){
        try {
            let orderLimit = LimitOrders || 20 ;
            const idAdmin = await conn2Db.conn.query(comandos.Admin.mostrarIdAdmin,[userAdmin]).then(([row,field])=>row[0].idAdmin) || "";
            const ordenes = await conn2Db.conn.query(comandos.Productos.traerOrdenes, [idAdmin,orderLimit]).then(([row,field])=>row)
            return success.getSuccess(ordenes);
        } catch (err) {
            return error.getError(err);
        }
    }
    async traerProductos(limitProducts, userAdmin){
        try {
            let productLimit = limitProducts || 20;
            const idAdmin = await conn2Db.conn.query(comandos.Admin.mostrarIdAdmin,[userAdmin]).then(([row,field])=>row[0].idAdmin) || "";
            const products = await conn2Db.conn.query(comandos.Productos.traerProductos, [idAdmin,productLimit]).then(([row,field])=>row)
            return success.getSuccess(products);
        } catch (err) {
            return error.getError(err); 
        }
    }

}
module.exports = ProductoController;