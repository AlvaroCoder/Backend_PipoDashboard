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

// Middlewares
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.get('/',(req,res)=>{
    const greeting = "<h1>Hello From Node on Fly!</h1>"
    res.send(greeting)
})
app.use('/admin',admin);
app.use('/costumer', costumer);
app.use('/product',product);
app.use('/client', clients);
app.use('/credits',credits);
app.use('/test',test_mysql);

// //test
// const fastify = require('fastify')({ logger: true })

// // Declare a route
// fastify.get('/', async (request, reply) => {
//   return { hello: 'world' }
// })

// // Run the server!
// const start = async () => {
//   try {
//     await fastify.listen(8080,"0.0.0.0")
//     fastify.log.info(`server listening on ${fastify.server.address().port}`)
//   } catch (err) {
//     fastify.log.error(err)
//     process.exit(1)
//   }
// }
// start()

app.listen(PORT,()=>{
    console.log(`Server running on server ${PORT}`);
});