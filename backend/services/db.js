const mysql = require("mysql");
const keys = require("../../config/keys");

var pool;

pool = mysql.createPool({
    host: keys.databaseHost,
    user: keys.databaseUser,
    password: keys.databasePassword,
    database: keys.database,
    charset: "utf8mb4"
});

module.exports = pool;