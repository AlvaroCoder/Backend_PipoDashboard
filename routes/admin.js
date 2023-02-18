const router = require('express').Router();
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const { ValidateUser } = require('../Controller/User');

router.post('/',async (req, res)=>{
    const body = req.body
    const idadmin = uuid.v4()
    const hash = bcrypt.hashSync(body.contrasenna, 10);
    
    body.idadministrador = idadmin
    body.contrasenna_hash = hash

    console.log(body);
    await Admin.Create(body);

    jwt.sign({
        idadministrador: body.idadministrador,
        usuario : body.usuario,
        contrasenna : body.contrasenna,
        contrasenna_hash : body.contrasenna_hash
    }, process.env.TOKEN_SECRET,{expiresIn : '1d'},(err, token)=>{
        if (err) {
            res.status(400).send({message : 'Error'})
        }
        res.status(202).send({message : 'Success',token : token})
    })
    
});

router.get('/signin',async (req,res, next)=>{
    const user = req.headers['user-name'] || ''
    // Validamos si el usuario esta en nuestra base de datos
    try {
        const result = await ValidateUser(user)
        if (result == 2) return res.redirect('http://localhost:8086/costumer/');
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);        
    }
});

router.get('/signin', async (req, res)=>{
    try {
        const user = req.headers['user-name'] || ''
        const pass = req.headers['user-password'] || ''
        const admin = await Admin.GetPassHashByUser(user) || {message : []};
        if (!admin.message[0]) return res.sendStatus(404);
    
        const result = await bcrypt.compare(pass, admin.message[0].contrasenna_hash);
        if (!result) return res.status(400).send({message : 'Contraseña inválida'});
    
        const body = await Admin.GetAdmin(user);
        const token = jwt.sign(body.message[0], process.env.TOKEN_SECRET, {expiresIn : '1d'});
        res.header('authorization').send({
            error: null,
            data: { token }
        })
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get('/logout',(req,res)=>{
    
})

router.get('/id',(req, res)=>{
    res.send('Hola soy el id')
});

module.exports = router;