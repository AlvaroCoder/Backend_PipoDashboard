const routes = require('express').Router();
const Clients = require('../models/clients');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const {fetchDniData, fetchRucData} = require('../services/sunat')
routes.get('/', async (req, res, next)=>{
    const response = await Clients.GetClients();
    res.status(response.status).send(response.message); 
});

routes.get('/:idcliente',async (req,res)=>{
    const id = req.params.idcliente
    const response = await Clients.GetClientBytId(id);
    res.send(response.message);
})

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

routes.get("/data/:documento",async (req,res)=>{
    const doc = req.params.documento;

    if (doc.length == 8) {
        const data = await fetchDniData(doc)
        const apellido = `${data.apellidoPaterno} ${data.apellidoMaterno}`
        const nombre = data.nombres
        const client = {
            nombre,
            apellido
        }
        res.status(202).send(client);
        return;
    }
    if (doc.length == 11) {
        const data = await fetchRucData(doc)
        res.status(202).send(data);
        return;
    }
    res.send({
        status : 200,
        message : 'Documento equivocado'
    })

})

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
    await Clients.UpdateNombre(idCliente, name)
    res.send(Clients.message)
});

routes.put("/apellido/:apellido",async (req,res)=>{
    const apellido = req.params.apellido.toUpperCase()
    const idCliente = req.headers['client-id']
    await Clients.UpdateApellido(idCliente, apellido);
    res.send(Clients.message); 
});

routes.put("/tel/:telephone", async (req, res)=>{
    const tel = Number(req.params.telephone)
    const idCliente = req.headers['client-id']
    await Clients.UpdateTelephone(idCliente, tel)
    res.send(Clients.message);
});

// Usamos headers para que sean privados la información

routes.put("/email",async (req,res)=>{
    const idCliente = req.headers['client-id']
    const email =  req.headers['client-email']
    await Clients.UpdateEmail(idCliente, email);
    res.send(Clients.message);
});

routes.put("/saldo",async(req,res)=>{
    const saldo = req.headers['client-saldo']
    const idCliente = req.headers['client-id']
    await Clients.UpdateSaldo(idCliente, saldo);
    res.send(Clients.message)
})


routes.put("/rznsc",async(req,res)=>{
    const idCliente = req.headers['client-id']
    const razon_social = req.headers['client-rznsc']
    await Clients.UpdateRazonSocial(idCliente, razon_social)
    res.send(Clients.message);
});


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
    body.nro_doc = Number(body.nro_doc)
    body.credito_limite = Number(body.credito_limite) || 200
    body.nombre = body.nombre.toUpperCase();
    body.apellido = body.apellido.toUpperCase();
    console.log("🚀 ~ file: clients.js:116 ~ routes.post ~ body:", body)
    await Clients.Create(body);
    res.status(202).send(Clients.message)
});

routes.delete('/',async(req,res,next)=>{
    const authHeader = req.headers["authorization"];
    if (authHeader == null) return res.sendStatus(403);
    jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(404);
        next();
    });
});

routes.delete('/',async(req,res)=>{
    const idcliente = req.headers['client-id']
    await Clients.DeleteClient(idcliente)
    res.send(Clients.message)
})


module.exports = routes;