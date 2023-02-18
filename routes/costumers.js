const { GetProveedores } = require('../models/proveedor');

const router = require('express').Router();

router.get('/', async (req, res)=>{
    const result = await GetProveedores();
    res.send(result);
});

router.post('/',async(req,res)=>{
    const body = req.body
    
})
module.exports = router