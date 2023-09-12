const multer = require('multer');
const routes = require('express').Router();
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const ProductoController = require('../Controller/ProductoController');
const ProveedorController = require('../Controller/ProveedorController');
const ImagenController = require('../Controller/ImagenController');

const productoController = new ProductoController();
const imagenController = new ImagenController();


routes.get("/", async (req,res)=>{
    const limitProduct = req.headers['limit-product'];
    const userAdmin = req.headers['admin-user']
    const rpta = await productoController.traerProductos(20, userAdmin);
    res.send(rpta);
});

routes.get("/ordenes",async(req,res)=>{
    const userAdmin = req.headers['admin-user'];
    const rpta = await productoController.traerOrdenes(20,userAdmin);
    res.send(rpta);
});

// routes.post("/",(req,res,next)=>{
//     const authHeader = req.headers["authorization"];
//     if (authHeader == null) return res.sendStatus(403);
//     jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(404);
//         console.log('token_correcto');
//         next();
//     });
// });

routes.post("/orden",async (req,res,next)=>{
    const {proveedor} = req.body;
    const proveedorController = new ProveedorController();
    const existeProveedor = await proveedorController.existeProveedorDoc(proveedor.documento);
    if (!existeProveedor) {
        const {idAdmin,proveedor} = req.body;  
        await proveedorController.guardarProveedor(idAdmin, proveedor);
    }
    next();
});

routes.post("/orden",async (req,res)=>{
    // Generate Orden de Inventario
    const body = req.body;
    const rpta = await productoController.guardarOrden(body);
    res.send(rpta);
});


const redimensionarIMG =(direccionArchivo,nombreArchivo, tamanno = 300)=>{
    return sharp(direccionArchivo)
        .resize(tamanno, tamanno)
        .toFile(`./Public/Optimizado/${nombreArchivo}`)
}

const almacImagen = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, './Public/Images')
    },
    filename : (req,file,cb)=>{
        const extension = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${extension}`)
    }
});
const cargarImagen = multer({storage : almacImagen});

routes.post("/",cargarImagen.single("imagen"),async(req,res)=>{
    const body = req.body;
    const imagen = req.file;

    await redimensionarIMG(imagen.path, `optimizado-${imagen.filename}`);
    const idImagen = await imagenController.guardarImagen(body, imagen);
    const rpta = await productoController.guardarProducto(body,idImagen.message);
    const urlOptimizado = `Public/Optimizado/optimizado-${imagen.filename}`
    fs.unlink(imagen.path,(err)=>{
        if (err) {
            console.log(err)
        }
    });
    fs.unlink(urlOptimizado,(err)=>{
        if (err) {
            console.log(err)
        }
    });
    
    res.send(rpta);
});

module.exports = routes;