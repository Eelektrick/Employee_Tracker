let mysql = require("mysql");

let conn = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"",
    database:"business_db"
});