const { request } = require("express");
const express = require("express");
const parser = require("body-parser").json();
const router = express.Router();

const pg = require("pg");
const client = new pg.Client({
    user: 'student',
    host: '188.225.78.173',
    database: 'ithub_pg',
    password: 'ithub2020',
    port: 5432,
})
client.connect();

router.get("/setTable", (req, res) => {
    client.query( `
    CREATE TABLE users_olemika
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    login VARCHAR(20),
    password VARCHAR(20)
);`
        
    );
    res.send("Table created")
})

router.post("/create", parser, (req, res) => {
    console.log(req.body);
    res.send({
        "code" : res.statusCode,
        "message" : "ok"
    })
});

router.get("/usr/:id", (req, res) => {
    console.log(req.params.id);

    //select name login from users  where id = id ${req.params.id}
    client.query();
    client.query(`SELECT * from Users where id = ${req.params.id}`, function(err,rows, fields))

    let data = {
        "name": "John",
        "login": `${req.params.id}`
    };
    res.send(data);
})

module.exports = router;