require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8087

const costumer = require('./routes/costumers');
const admin = require('./routes/admin');
const product = require('./routes/products');
const clients = require('./routes/clients');
const credits = require('./routes/credits');


// Middlewares
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use('/admin',admin);
app.use('/costumer', costumer);
app.use('/product',product);
app.use('/client', clients);
app.use('/credits',credits);

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});