const uuid = require('uuid');
const Fechas = require('./Fechas');
const { SumPriceProducts } = require('../Services/ProductsService');
class OrdenInventario{
    constructor(idTienda,nombreTienda,idAdmin,productos ){
        this.idTienda = idTienda;
        this.nombreTienda = nombreTienda;
        this.idAdmin = idAdmin;
        this.idOrdenInventario ="";
        this.fechaCreacion = "";
        this.productos = productos || [];
    }
}


class ConstructorOrdenInventario {
    constructor(){
        this.idOrdenInventario = uuid.v4();
        this.fechaCreacion = Fechas.fecha_creacion();
        this.idTienda = "";
        this.nombreTienda = "";
        this.idAdmin = "";
        this.productos =  [];
        this.estado = 0;
        this.importeTotal = 0;
        this.idProveedor = "";
    }
    setIdTienda(idTienda){
        this.idTienda = idTienda;
        return this;
    }
    setIdAdmin(idAdmin){
        this.idAdmin = idAdmin;
        return this;
    }
    setProductos(productos){
        this.productos = productos;
        this.importeTotal = SumPriceProducts(productos);
        return this;
    }
    setIdProveedor(idProveedor){
        this.idProveedor = idProveedor;
        return this;
    }
    setEstado(estado){
        this.estado = estado;
        return this;
    }
    construirSQLOrden(ordenesPrevias){
        return [this.idOrdenInventario, this.idTienda, this.idAdmin, ordenesPrevias+1, this.estado, this.fechaCreacion, this.importeTotal, this.idProveedor]
    }
}
class ConstructorProducto{
    constructor(){
        this.idProducto = uuid.v4();
        this.idOrdenInventario = "";
        this.codigo = "";
        this.nombre = "";
        this.color = "";
        this.stock = "";
        this.precioUnitario = "";
        this.idMarca = 0;
        this.idImage = 0;
        this.idAdmin = "";
        this.idTalla =0;
    }
    setIdAdmin(idAdmin){
        this.idAdmin = idAdmin;
        return this;
    }
    setIdOrdenInventario(idOrdenInventario){
        this.idOrdenInventario = idOrdenInventario;
        return this;
    }
    setCodigo(codigo){
        this.codigo = codigo;
        return this;
    }
    setNombre(nombre){
        this.nombre = nombre;
        return this;
    }
    setColor(color){
        this.color = color;
        return this;
    }
    setStock(stock){
        this.stock = stock;
        return this;
    }
    setPrecioUnitario(precioUnitario){
        this.precioUnitario = precioUnitario;
        return this;
    }
    setIdMarca(idMarca){
        this.idMarca = idMarca;
        return this;
    }
    setIdImage(idImage){
        this.idImage = idImage;
        return this;
    }
    setIdTalla(idTalla){
        this.idTalla = idTalla;
        return this;
    }
    construirSQLProducto(){
        return [this.idProducto, this.idOrdenInventario, this.idAdmin,this.codigo, this.nombre, this.color, this.stock, this.precioUnitario, this.idMarca, this.idImage, this.idTalla]
    }
}
module.exports = {ConstructorOrdenInventario, ConstructorProducto}