const { request } = require("express");
const express = require("express");
const parser = require("body-parser").json();
const router = express.Router();
// const client = require("./dbconfig");
const pool = require("./dbconfig");


router.post("/create", parser, (req, res) => {
    console.log("request: " + req)


    pool.query(`
    INSERT INTO users_olemika (login, name, password) 
    VALUES ($1, $2, $3) RETURNING id;
`, [req.body.login, req.body.name, req.body.password])
        .then(val => {
            console.log(val)
            res.status(200)
            res.send({
                "code": res.statusCode,
                "message": "ok",
                "user_id": val.rows[0].id
            })
        })
        .catch(err => {
            if (err.code === '23505') {
                res.status(403)
                res.send({
                    error: "Такой логин уже существует"
                })
            }
        })

});

router.post("/auth", parser, (req, res) => {
    pool
        .query(`
    SELECT id FROM users_olemika WHERE login = $1 AND password = $2`, [req.body.login, req.body.password])
        .then(val => {
            console.log(val)
            if (val.rowCount === 0) {
                res.status(404)
                res.send({
                    error: "Неправильный логин или пароль",
                    "message": "Неправильный логин или пароль"
                })
                console.log("empty")
            } else {
                res.status(200)
                res.send({
                    "code": res.statusCode,
                    "message": "Успешный вход",
                    "user_id": val.rows[0].id
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500)
        })

});

router.post("/update", parser, (req, res) => {
    console.log(req.body)
    pool
        .query(`
        UPDATE users_olemika SET name = '${req.body.name}', password = '${req.body.password}' WHERE id = '${req.body.id}' RETURNING *;`)
        .then(val => {
            console.log(val)
            if (val.rowCount === 0) {
                res.status(404)
                res.send({
                    error: "Что-то пошло не так"
                })
            } else {
                res.status(200)
                res.send({
                    "user_data": val.rows
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500)
        })

});


router.get("/all", (req, res) => {

    pool
        .query(`
    SELECT * FROM users_olemika`)
        .then(val => {
            console.log(val)
            if (val.rowCount === 0) {
                res.status(404)
                res.send({
                    error: "Пользователи не найдены",
                })
            } else {
                res.status(200)
                res.send({
                    "users": val.rows
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500)
        })
});


router.get("/:id", (req, res) => {
    console.log(req.params.id);


    pool
        .query(`
    SELECT id, login, name, password FROM users_olemika WHERE id = $1`, [req.params.id])
        .then(val => {
            console.log(val)
            if (val.rowCount === 0) {
                res.status(404)
                res.send({
                    error: "Пользователь не найден",
                })
            } else {
                res.status(200)
                res.send({
                    "login": val.rows[0].login,
                    "name": val.rows[0].name,
                    "user_id": val.rows[0].id,
                    "password": val.rows[0].password
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500)
        })
});




module.exports = router;