const ComandosSQL = {
    Cliente : {
        mostrarClientes : process.env.GET_CLIENTS_GENERAL,
        crear : process.env.CREATE_CLIENT,
        personarepetida : process.env.GET_REP_PERSONA,
        eliminar : process.env.DELETE_CLIENT,
        actualizar : process.env.UPDATE_CLIENT,
        mostrarClientePorId : process.env.GET_CLIENT_BY_ID
    },
    Persona : {
        crear : process.env.CREATE_PERSON,
        getId :  process.env.GET_IDPERSONA,
        eliminar : process.env.DELETE_PERSON,
        actualizar : process.env.UPDATE_PERSON
    },
    Proveedor :{
        crear : process.env.CREATE_PROVEEDOR,
        existProveedor : process.env.GET_PROVEEDORES_COUNT,
        existeProveedorDoc : process.env.GET_PROVEEDOR_BY_DOC_PERSONA,
        traerProveedores : process.env.GET_PROVEEDORES
    },
    Productos : {
        traerOrdenes : process.env.GET_ORDERS,
        traerProductos : process.env.GET_PRODUCTS,
        crear : process.env.CREATE_PRODUCT,
        crearMarca :process.env.CREATE_MARCA,
        crearOrden : process.env.CREATE_ORDER,
        ordenesPrevias : process.env.GET_ORDERS_PREV
    },
    SUNAT : {
        urlDNI : process.env.SUNAT_URL_DNI,
        urlRuc : process.env.SUNAT_URL_RUC,
        token : process.env.SUNAT_TOKEN
    },
    CLOUDINARY : {
        cloudName : process.env.CLOUDINARY_NAME,
        apiKey : process.env.CLOUDINARY_API_KEY,
        apiSecret : process.env.CLOUDINARY_API_SECRET
    },
    CREDITO : {
        crear : process.env.CREATE_CREDIT
    },
    Admin : {
        traerDetallesComp : process.env.GET_DETALLES_COMPROBANTE,
        traerCredentials : process.env.GET_CREDENTIALS,
        guardarCredentials : process.env.CREATE_CREDENTIALS,
        actualizarDetalleComp : process.env.UPDATE_CREDENTIALS,
        validarIdAdmin : process.env.GET_ADMIN_COUNT,
        traerDataAdmin :  process.env.GET_ADMIN_BY_USER,
        adminHashContraUser : process.env.GET_ADMIN_HASH,
        mostrarIdAdmin : process.env.GET_IDADMIN,
        crearAdmin : process.env.CREATE_ADMIN,
        createStore : process.env.CREATE_STORE
    },
    Imagenes : {
        guardarImagen : process.env.CREATE_IMAGEN
    }
}
module.exports = ComandosSQL;