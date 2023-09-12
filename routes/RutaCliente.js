const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const {ConstructorCliente} = require('../Models/ModelPersona')
const ClientController = require('../Controller/ClienteController');
const AdminController = require('../Controller/AdminController');

// Para la tabla principal de clientes de la UI
routes.get('/', async (req, res)=>{
    let maxData = 20 // numero máximo de filas
    const userAdmin = req.headers['admin-user'];
    const Admin = new AdminController()
    const idAdmin = (await Admin.traerIdAdminByUser(userAdmin)).message;
    const controladorCliente = new ClientController();
    const rpta = await controladorCliente.mostrarClientes(idAdmin,maxData);
    res.json(rpta);
}); 

// Para cuando se renderice la página de cada Cliente 
routes.get("/idCliente", async (req, res)=>{
    const idCliente = req.headers['client-id']
    const controllerCliente = new ClientController();
    const rpta = controllerCliente.buscarClienteId(idCliente);
    res.json(rpta);
});

routes.get('/s/nombre/:name',async(req,res)=>{
    const query = req.params.name
    const clienteController = new ClientController();
    const rpta = await clienteController.buscarClienteNombre(query);
    res.json(rpta);
});

routes.get('/s/apellido/:apellido',async(req,res)=>{
    const query = req.params.apellido;
    const clienteController = new ClientController();
    const rpta = await clienteController.buscarClienteApellido(query);
    res.json(rpta);
});

routes.get("/data/:documento",async (req,res)=>{
    const doc = req.params.documento;
    const clienteController = new ClientController();
    const rpta = await clienteController.buscarClienteSunat(doc);
    res.json(rpta);
});

routes.put('/',(req,res,next)=>{
    const authHeader = req.headers["authorization"];
    if (authHeader == null) return res.sendStatus(403);
    jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(404);
        next();
    });
})

routes.put('/', async (req,res)=>{
    const idCliente = req.headers['client-id']
    const body = req.body;

    const cliente = new ConstructorCliente()
    .setNombre(body.nombre.toUpperCase())
    .setApellido(body.apellido.toUpperCase())
    .setEmail(body.email)
    .setDocumento(Number(body.documento))
    .setDireccion(body.direccion)
    .setDetalle(body.detalle)
    .setFechaCumpleannos(body.fecha_cumpleannos)
    .setGenero(body.genero)
    .construir();

    const clienteController = new ClientController();
    const rpta = await clienteController.actualizarCliente(idCliente, cliente);
    res.json(rpta);
})

routes.post('/',(req,res, next)=>{
    const authHeader = req.headers["authorization"];
    if (authHeader == null) return res.sendStatus(403);
    jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(404);
        next();
    });
});

routes.post('/',async (req, res)=>{
    const body = req.body;
    const controllerCliente = new ClientController();
    const rpta = await controllerCliente.guardarCliente(body);
    res.json(rpta);
});

// routes.delete('/',async(req,res,next)=>{
//     const authHeader = req.headers["authorization"];
//     if (authHeader == null) return res.sendStatus(403);
//     jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(404);
//         next();
//     });
// });

routes.delete('/',async(req,res)=>{
    const idcliente = req.headers['client-id'];
    const controllerCliente = new ClientController();
    const rpta = await controllerCliente.eliminarCliente(idcliente);
    res.json(rpta);
});


module.exports = routes;