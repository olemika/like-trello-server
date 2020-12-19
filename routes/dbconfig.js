const {Client} = require("pg");

const client = new Client({
    user: "student",
    host: "188.225.78.173",
    database: "ithub_pg",
    password: "ithub2020",
    port: 5432,
});

module.exports = client;