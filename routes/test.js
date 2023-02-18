const router = require('express').Router();
const pool = require('../mysql/mysql_querys');

router.get('/',async (req,res)=>{
    const result = await pool.query('SELECT * FROM administrador;').then(val=>val[0][0])
    console.log(result);
    res.send("Conexion exitosa")
})

module.exports = router;