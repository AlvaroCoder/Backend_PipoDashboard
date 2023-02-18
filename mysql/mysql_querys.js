const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    host : process.env.DATABASE_HOST,
    database : process.env.DATABASE_NAME,
    ssl : {
        rejectUnauthorized : false
    }
});

module.exports = pool