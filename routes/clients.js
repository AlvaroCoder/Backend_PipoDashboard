const routes = require('express').Router();
const puppeteer = require('puppeteer');
const Clients = require('../models/clients');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

routes.get('/', async (req, res, next)=>{
    const result = await Clients.GetClients()
    res.status(result.status).send(result.message); 
});
routes.get('/s/nombre/:name',async(req,res)=>{
    const q = req.params.name
    const response = await Clients.GetClients();
    const result = response.message.filter((cliente)=>{
        const {nombre} = cliente
        return nombre.toUpperCase().includes(q.toUpperCase())
    })
    res.send(result)
});
routes.get('/s/apellido/:apellido',async(req,res)=>{
    const q = req.params.apellido
    const response = await Clients.GetClients();
    const result = response.message.filter((cliente)=>{
        const {apellido} = cliente
        return apellido.toUpperCase().includes(q.toUpperCase())
    })
    res.send(result);
})

routes.get("/idCliente", async (req, res)=>{
    const idCliente = req.headers['client-id']
    const result = await Clients.GetClientBytId(idCliente)
    res.status(result.status).send(result.message)
});

routes.put('/',(req,res,next)=>{
    const authHeader = req.headers["authorization"];
    if (authHeader == null) return res.sendStatus(403);
    jwt.verify(authHeader, "secret_key", (err, user) => {
        if (err) return res.sendStatus(404);
        next();
    });
})

routes.put("/name/:name",async (req, res)=>{
    const name = req.params.name.toUpperCase()
    const idCliente = req.headers['client-id']
    const result = await Clients.UpdateNombre(idCliente, name)
    res.status(result.status).send(result.message);
});

routes.put("/apellido/:apellido",async (req,res)=>{
    const apellido = req.params.apellido.toUpperCase()
    const idCliente = req.headers['client-id']
    const result = await Clients.UpdateApellido(idCliente, apellido);
    res.send(result) 
})

routes.put("/tel/:telephone", async (req, res)=>{
    const tel = Number(req.params.telephone)
    const idCliente = req.headers['client-id']
    const result = await Clients.UpdateTelephone(idCliente, tel)
    res.status(result.status).send(result.message);    
})

routes.post('/',(req,res, next)=>{
    const authHeader = req.headers["authorization"];
    if (authHeader == null) return res.sendStatus(403);
    jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(404);
        console.log('token_correcto');
        next();
    });
});

routes.post('/',async (req, res)=>{
    const body = req.body;
    const date = new Date()
    body.idcliente = uuid.v4()
    body.fecha_creacion = date.getFullYear()+'-'+(date.getUTCMonth()+1).toString().padStart(2, "0")+'-'+date.getUTCDate().toString().padStart(2, "0")
    body.razon_social = Number(body.razon_social)
    body.credito_limite = Number(body.credito_limite)
    body.nombre = body.nombre.toUpperCase();
    body.apellido = body.apellido.toUpperCase();
    const result = await Clients.Create(body)
    res.send(result)
});

routes.delete('/',async(req,res)=>{
    const idcliente = req.headers['client-id']
    const response = await Clients.DeleteClient(idcliente)
    res.send(response);
})


module.exports = routes;