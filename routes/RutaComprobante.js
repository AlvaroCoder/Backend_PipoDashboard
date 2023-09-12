const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const ProductoController = require('../Controller/ProductoController');
const ProveedorController = require('../Controller/ProveedorController');

const productoController = new ProductoController();

routes.get('/', async (req,res)=>{
    const userAdmin = req.headers['admin-user'];
    const rpta = await productoController.traerOrdenes(20,userAdmin);
    res.send(rpta);
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

routes.post("/",(req,res)=>{
    
});

module.exports = routes