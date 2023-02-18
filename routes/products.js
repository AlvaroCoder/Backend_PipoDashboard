const Product = require('../models/product');
const multer = require('multer');
const routes = require('express').Router()
const path = require('path')
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { CreateProveedor } = require('../models/product');

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

const idImage = Date.now()
const diskStorage = multer.diskStorage({
    destination : path.join(process.cwd(),'Public','Images'),
    filename : (req,file,cb)=>{
        cb(null, idImage+path.extname(file.originalname))
    }
});
const fileUpload = multer({
    storage : diskStorage
});
routes.get('/',(req, res)=>{
    
    res.send('Bienvenido product')
});
routes.get('/id',async (req,res)=>{
    const result = await Product.GetIdProduct();
    res.send(result);
})
routes.get('/generalData',async(req,res)=>{
    const marca = await Product.GetMarcas();
    const date = new Date()
    const date_today = date.getFullYear() + "-"+ date.getMonth()+"-"+date.getDay()
    const almacen = await Product.GetAlmacen();
    const numProducts = await Product.GetNumLote();
    const tipo_pedido = await Product.GetTipoLote();
    const obj = {marca, date_today, almacen, numProducts, tipo_pedido}
    res.send(obj);
});
routes.post("/",(req,res,next)=>{
    const authHeader = req.headers["authorization"];
    if (authHeader == null) return res.sendStatus(403);
    jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(404);
        console.log('token_correcto');
        next();
    });
});
routes.get("/s/product/:product",async (req,res)=>{
    const product = req.params.product
    const response = await Product.GetIdProduct()
})
routes.post("/",async (req,res)=>{
    const body = req.body;
    body.nro_ref = Date.now()
    console.log(body);
    const productos = body.productos || []
    // await CreateProveedor(body.proveedor);
    // for (let index = 0; index < productos.length; index++) {
    //     let idProducts = uuid.v4()
    //     let stock = productos[index].nro_unidades * productos[index].cantidad
    //     let len = productos[index].nro_unidades
    //     productos[index].idProduct = idProducts
    //     productos[index].stock = stock  
    //     let tallas = [] ;
    //     let cantidad = Number(productos[index].cantidad);
    //     let talla_i = Number(productos[index].talla_inicio);     
    //     while (len>0) {
    //         let talla = talla_i+(productos[index].nro_unidades-len)
    //         let obj = JSON.parse(`{"${talla}":${cantidad}}`)
    //         tallas.push(JSON.stringify(obj))
    //         len--;
    //     }
    //     productos[index].tallas = tallas;
    // }
    res.sendStatus(200)
});
routes.post("/img",fileUpload.single("imgProduct"),(req,res)=>{
    const {titleImage} = req.body
    const images = fs.readdirSync(path.join(process.cwd(),'Public','Images'))
    const copyImages = [...images]
    copyImages.forEach((el)=>{
        fs.unlink(path.join(process.cwd(),'Public','Images',el),(err)=>{
            if (err) {
                console.log(err);
            }
        })
    })
    res.sendStatus(200);

});
routes.post('/marca',(req,res,next)=>{
    const authHeader = req.headers['authorization']
    if (authHeader == null) return res.sendStatus(403); 
    jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(404);
        next();
    });
});
routes.post('/marca', async (req,res)=>{
    const body = req.body
    await Product.CreateMarca(body);
    res.sendStatus(200)
});
module.exports = routes;