const routes = require('express').Router()

routes.get('/',(req,res)=>{
    
});

routes.post('/',(req,res)=>{
    const authHeader = req.headers["authorization"];
    if (authHeader == null) return res.sendStatus(403);
    jwt.verify(authHeader, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(404);
        console.log('token_correcto');
        next();
    });
});

routes.post('/',(req,res)=>{
    const body = req.body;
    console.log(body);
    res.sendStatus(200)
});

module.exports = routes