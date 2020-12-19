const { request } = require("express");
const express = require("express");
const parser = require("body-parser").json();
const router = express.Router();
const client = require("./dbconfig");


// router.get("/setTable", (req, res) => {
//     client.query( `
//     CREATE TABLE users_olemika
// (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255),
//     login VARCHAR(20),
//     password VARCHAR(20)
// );`

//     );
//     res.send("Table created")
// })

router.post("/create", parser, (req, res) => {
    client.connect();
    client.query(
        `
    CREATE TABLE IF NOT EXISTS users_olemika
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    login VARCHAR(50),
    password VARCHAR(50),
    boards VARCHAR(30) [],
    tasks INT []
);` , (err, val) => {
        if (err) {
            console.log(err);
            client.end();
        }
        
    });

    // client.connect();
    client.query(
        `
            INSERT INTO users_olemika (login, name, password) 
            VALUES ($1, $2, $3) RETURNING id;
        `, [req.body.login, req.body.name, req.body.password], (err, val) => {
            console.log(val);
            if (val.rows.length) {
                res.send({
                    "code": res.statusCode,
                    "message": "ok"
                })
            }
            client.end();
    }
    );

    console.log(req.body);
});

router.post("/auth", parser, (req, res) => {
    client.connect();
    client.query(`
    SELECT * FROM users_olemika WHERE login = $1 AND password = $2`, [req.body.login, req.body.password], (err, val) => {
        console.log(val.rows[0])
        
        if (val && val.rows.length){
            client.end();
            res.send({msg: "200"})
            
        } else {
            client.end();
            res.send({
                msg: "Все плохо!"
            })
        }
        
        
    });
});

router.get("/usr/:id", (req, res) => {
    console.log(req.params.id);

    //select name login from users  where id = id ${req.params.id}
    client.query();

    let data = {
        "name": "John",
        "login": `${req.params.id}`
    };
    res.send(data);
})

module.exports = router;