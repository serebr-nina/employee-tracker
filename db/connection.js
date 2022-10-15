const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MoiProchniy#5",
    database: "employees"
});

connection.connect(function(err) {
    if (err) throw err;
 });