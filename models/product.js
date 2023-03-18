const pool = require('../mysql/mysql_querys');
const GET_ID_PRODUCT = "SELECT COUNT(*)  AS IdProduct FROM producto;";
const GET_ID_MARCA = "SELECT COUNT(*) FROM marca;";
const GET_CATEGORY = "SELECT nombre, valor AS displayName FROM categoria;"
const GET_MARCAS = "SELECT idmarca AS id,nombre FROM marca";
const GET_ALMACENES = "SELECT idalmacen AS id, codigo, nombre_almacen AS nombre FROM almacen;"
const GET_TIPO_LOTE = "SELECT idtipo_pedido AS id, nombre FROM tipo_pedido;"
const GET_NUM_LOTES ="SELECT COUNT(*) AS IdProduct FROM lote_productos;"
const INSERT_TO_MARCA = "INSERT INTO marca (idmarca, nombre) VALUES (?, ?) ON DUPLICATE KEY UPDATE nombre = ?"
const INSERT_LOTE_PRODUCTOS = "INSERT INTO lote_productos (almacen_idalmacen, fecha_llegada, idtipo_pedido, nro_ref) VALUES (?,?,?,?)"
const INSERT_PRODUCT = "INSERT INTO product (idProducto, codigo, nombre, color, stock, precio_unitario, marca_idmarca) VALUES (?,?,?,?,?,?,?,?,?)"
const SAVE_PROVEEDOR = "INSERT INTO proveedor(nombre) VALUES (?)"
const INSERT_LOTE_PRODUCT = "INSERT INTO lote_producto (producto_idproducto, producto_marca_idmarca, lote_productos_idlote_productos, nro_unidades, cantidad, talla_inicial, talla_final) VALUES(?,?,?,?,?,?,?)"
const Product = {
    idProduct : 0,
    message : {error : false, status : 202, message : ''},
    GetIdProduct : async function () {
        return await pool.query(GET_ID_PRODUCT).then(el=>{
            return el[0].length
        });
    },
    CreateContainerProducts : async function ({idalmacen, fecha_llegada, tipo_pedido, nro_ref}) {
        try {
            await pool.execute(INSERT_LOTE_PRODUCTOS,[idalmacen, fecha_llegada, tipo_pedido, nro_ref]).then(el=>{
                return el[0]
            })
        } catch (err) {
            this.message.error = true
            this.message.status = 400
            this.message.message = err
        }
    },
    CreateProduct : async function ({idProduct,codigo, nombre,color,talla_inicial,talla_final,nro_unidades,cantidad,marca,stock, precio_unitario}) {
        try {
            await pool.execute(INSERT_PRODUCT, [idProduct, codigo, nombre,color, stock, precio_unitario, marca])
            await pool.execute()
        } catch (err) {
            
        }
    },  
    CreateMarca : async function ({id, nombre}) {
        try {
            await pool.execute(INSERT_TO_MARCA, [id, nombre, nombre])
        } catch (error) {
            throw error
        }
    },
    GetMarcas : async function () {
        return await pool.query(GET_MARCAS).then(el=>{
            return el[0]
        })
    },
    GetAlmacen : async function () {
        return await pool.query(GET_ALMACENES).then(el=>{
            return el[0]
        });
    },
    GetTipoLote : async function () {
        return await pool.query(GET_TIPO_LOTE).then(el=>{
            return el[0]
        });
    },
    GetNumLote : async function () {
        return await pool.query(GET_NUM_LOTES).then(el=>{
            return el[0].length
        });
    },
    CreateProveedor : async function (proveedor) {
        return await pool.execute(SAVE_PROVEEDOR,[proveedor]).then(el=>{
            return el[0].length
        });
    },
    GetCategoria : async function () {
        return await pool.query(GET_CATEGORY).then(el=>el[0])
    },
    GetProduct : async function (name) {
        
    }

}   

module.exports = Product