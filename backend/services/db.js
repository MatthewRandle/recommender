const mysql = require("mysql");
const keys = require("../../config/keys");
const fs = require("fs");

var pool;

if(process.env.NODE_ENV === "development") {
    pool = mysql.createPool({
        host: keys.databaseHost,
        user: keys.databaseUser,
        password: keys.databasePassword,
        database: keys.database,
        charset: "utf8mb4"
    });
}
else {
    pool = mysql.createPool({
        host: keys.databaseHost,
        user: keys.databaseUser,
        password: keys.databasePassword,
        database: keys.database,
        charset: "utf8mb4"/* ,
        ssl: {
            ca: fs.readFileSync(keys.mysqlCA),
            key: fs.readFileSync(keys.mysqlKey),
            cert: fs.readFileSync(keys.mysqlCert)
        } */
    });
}

module.exports = pool;