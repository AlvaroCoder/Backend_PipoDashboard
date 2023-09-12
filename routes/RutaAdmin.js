const router = require('express').Router();
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { ConstructorAdmi } = require('../Models/Admi');
const AdminController = require('../Controller/AdminController');
const TiendaController = require('../Controller/TiendaController');

const adminController = new AdminController();
const {ErrorResponse, SuccesResponse} = require('../Models/HttpResponse')
const success = new SuccesResponse();
const error = new ErrorResponse();
router.get('/signin',(req,res,next)=>{
    const usuario = req.headers['user-admin']
    const pass = req.headers['pass-admin']

    if (usuario.trim() == "" || pass.trim() == "") {
        res.send(error.getError("Complete los campos!"))
        return;
    }
    next();
});

router.get('/signin', async (req, res)=>{
    const usuario = req.headers['user-admin']
    const pass = req.headers['pass-admin']
    const rpta = await adminController.ingresarAdmin(usuario, pass);
    if (!rpta.error) {
        const token = jwt.sign(rpta, process.env.TOKEN_SECRET, {expiresIn : '1d'});
        const response = success.getSuccess(token)
        res.send(response);
        return;
    }
    res.send(rpta);
});

router.get("/nubefact/search",async(req,res)=>{
    const idAdmin = req.headers['admin-id'];
    const tipoDocumento = req.headers['tipo-documento']
    const serieDocumento = req.headers['serie-documento']
    const numeroDocumento = req.headers['numero-documento']
    const rpta = await adminController.consultarBoleta(idAdmin, tipoDocumento, serieDocumento, numeroDocumento);
    res.send(rpta);
});


router.post('/',async (req, res)=>{
    const body = req.body
    const idAdmin = uuid.v4()
    const hash = bcrypt.hashSync(body.contrasenna, 10);
    
    const AdminObject = new ConstructorAdmi()
    .setIdAdmin(idAdmin)
    .setRazonSocial(body.razonSocial)
    .setDocumento(body.documento)
    .setUsuario(body.usuario)
    .setEmail(body.email)
    .setContrasenna(body.contrasenna)
    .setContrasennaHash(hash)
    .construir();

    const rpta = await adminController.guardarAdminUser(AdminObject);
    res.send(rpta);
});

router.post("/nubefact/credentials",async(req,res,next)=>{
    const idAdmin = req.headers['admin-id'];
    const existeIdAdmin = await adminController.validarExisteAdminId(idAdmin);
    if(!existeIdAdmin) return res.status(404).send("Id Incorrecto");
    next();
});
router.post("/nubefact/credentials",async(req,res)=>{
    const credentials = req.body;
    const idAdmin = req.headers['admin-id'];
    const rpta = await adminController.guardarCredentials(idAdmin,credentials);
    res.send(rpta);
});
router.put("/nubefact/comprobante",async(req,res)=>{
    const idCredential = req.headers['credential-id'];
    const body = req.body;
    const rpta = await adminController.actualizarDetalleComprobante(idCredential, body);
    res.send(rpta);
});
router.post("/nubefact/comprobante",async(req,res)=>{
    const idAdmin = req.headers['admin-id'];
    const body = req.body;
    
    const rpta = await adminController.guardarComprobante(idAdmin, body);
    res.send(rpta);
});


router.post('/createStore',async (req,res)=>{
    const body = req.body;
    const tiendaController = new TiendaController();
    const rpta = await tiendaController.crearTienda(body);
    res.send(rpta);
});


module.exports = router;