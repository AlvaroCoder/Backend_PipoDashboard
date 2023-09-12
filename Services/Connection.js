// Singleton Pattern
const mysql2 = require('mysql2/promise');
let instance = null
class MYSQLConnection{
    constructor(){
        this.user = process.env.DATABASE_USER;
        this.password = process.env.DATABASE_PASSWORD;
        this.host = process.env.DATABASE_HOST;
        this.database = process.env.DATABASE_NAME;
        this._conn = null
    }
   connect(){
        this._conn = mysql2.createPool({
            user : this.user,
            password : this.password,
            host : this.host,
            database : this.database,
            ssl : {
                rejectUnauthorized : false
            }
        })
    }
    get conn(){
        return this._conn;
    }
    static getInstance(){
        if (!instance) {
            instance = new MYSQLConnection();
        }
        return instance
    }
}
module.exports = MYSQLConnection;