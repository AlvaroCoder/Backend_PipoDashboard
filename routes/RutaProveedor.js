const router = require('express').Router();
const ProveedorController = require('../Controller/ProveedorController');
const ConnectionDatabase = require('../Services/Connection');
const conn2Db = ConnectionDatabase.getInstance();

const proveedorController = new ProveedorController();
conn2Db.connect();

router.get('/', async (req, res)=>{
    const userAdmin = req.headers['admin-user'];
    const rpta = await proveedorController.traerProveedores(userAdmin,20);
    res.send(rpta);
});
router.post("/",async(req,res,next)=>{
    const proveedor = req.body;
    const existeProveedor = await proveedorController.existeProveedorDoc(proveedor.documento);
    if (!existeProveedor) return res.status(400).send("Ya existe el proveedor");
    next(); 
});
router.post('/',async(req,res)=>{
    const proveedor = req.body
    const idAdmin = req.header['admin-id'];
    const rpta = await proveedorController.guardarProveedor(idAdmin, proveedor);
    res.send(rpta);
});
module.exports = router