require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080

const costumer = require('./routes/costumers');
const admin = require('./routes/admin');
const product = require('./routes/products');
const clients = require('./routes/clients');
const credits = require('./routes/credits');
const test_mysql =  require('./routes/test');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name : process.env.CLUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

// Middlewares
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.get('/',(req,res)=>{
    const greeting = `
    <h1>Hello From Node on Fly!</h1>
    `
    res.send(greeting)
})

app.use('/admin',admin);
app.use('/costumer', costumer);
app.use('/product',product);
app.use('/client', clients);
app.use('/credits',credits);
app.use('/test',test_mysql);

app.listen(PORT,()=>{
    console.log(`Server running on server ${PORT}`);
});