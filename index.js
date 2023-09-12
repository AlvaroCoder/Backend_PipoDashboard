require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080

const proveedor = require('./routes/RutaProveedor');
const admin = require('./routes/RutaAdmin');
const product = require('./routes/RutaProducto');
const clients = require('./routes/RutaCliente');
const comprobante = require('./routes/RutaComprobante');

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.get('/',(req,res)=>{
    const greeting = `
    <h1>Hello From Node on Fly!</h1>
    `
    res.send(greeting)
});

app.use('/admin',admin);
app.use('/proveedor', proveedor);
app.use('/product',product);
app.use('/client', clients);
app.use('/comprobante',comprobante);

app.listen(PORT,()=>{
    console.log(`Server running on server ${PORT}`);
});