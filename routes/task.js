const express = require("express");
const parser = require("body-parser").json();
const router = express.Router();
const pool = require("./dbconfig");

//создать таск
router.post("/create", parser, (req, res) => {
    console.log(`request body = ${req.body}`);
    pool.query(`
    INSERT INTO tasks_olemika (name, description, date_to, status, user_id, board_id, tag) 
    VALUES ('${req.body.name}', '${req.body.description}', '${req.body.date_to}', ${req.body.status}, ${req.body.user_id}, ${req.body.board_id}, '${req.body.tag}') RETURNING *;
`)
        .then(val => {
            console.log(val)
            res.status(200)
            res.send({
                "newtask": val.rows,
                "message": "Таск создан",
            })
        })
        .catch(err => {
            console.log(err)
            res.send({
                error: "Все плохо!"
            })
        })
});


//Изменить статус таска (перетащить колонку)
router.post("/setstatus", parser, (req, res) => {
    console.log(req.body);

    pool.query(`
    UPDATE tasks_olemika SET status = ${req.body.status} WHERE id = ${req.body.id} RETURNING *
`)
        .then(val => {
            console.log(val)
            res.status(200)
            res.send({
                "task": val.rows,
                "message": "Таск обновлен",
            })
        })
        .catch(err => {
            console.log(err)
            res.send({
                error: "Все плохо!" + err
            })
        })
});


//редактировать поля таска
router.post("/update", parser, (req, res) => {
    console.log(`Редактируем таск.Реквест: id: ${req.body.id}, name: ${req.body.name},des: ${req.body.description}, dateto: ${req.body.date_to}, user: ${req.body.user_id}, tag: ${req.body.tag}`);

    pool.query(`
    UPDATE tasks_olemika 
    SET name = '${req.body.name}', description = '${req.body.description}', date_to = '${req.body.date_to}', user_id = '${req.body.user_id}', tag = '${req.body.tag}'
     WHERE id = '${req.body.id}' RETURNING *;
`)
        .then(val => {
            console.log("Таск обновлен")
            res.status(200)
            res.send({
                "task": val.rows,
                "message": "Таск обновлен",
            })
        })
        .catch(err => {
            console.log(err)
            res.send({
                error: "Все плохо!" + err
            })
        })
});

//удалить таск
router.post("/delete", parser, (req, res) => {
    console.log(`Удаляем таск. Реквест: ${req.body}`);

    pool.query(`
    DELETE FROM tasks_olemika 
     WHERE id = ${req.body.id} RETURNING *
`)
        .then(val => {
            console.log(val)
            res.status(200)
            res.send({
                "task": val.rows,
                "message": "Таск удален",
            })
        })
        .catch(err => {
            console.log(err)
            res.send({
                error: "Все плохо!" + err
            })
        })
});

module.exports = router;

