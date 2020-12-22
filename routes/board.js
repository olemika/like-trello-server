const e = require("express");
const express = require("express");
const parser = require("body-parser").json();
const router = express.Router();
const pool = require("./dbconfig");

//Получить все борды по юзер_айди
router.get("/all/:id", parser, (req, res) => {
    console.log("Получаем борды " + req.params)
    pool
        .query(`
            SELECT b.name, b.id FROM boardUsers_olemika bu
            JOIN boards_olemika b 
            ON b.id = bu.board_id 
            WHERE bu.user_id = $1`, [req.params.id])
        .then(val => {
            if (val.rowCount === 0) {
                res.status(200)
                res.send({
                    "boards": val.rows,
                    error: "Борды не найдены",
                })
            } else {
                res.status(200)
                res.send({
                    "user": req.params.id,
                    "boards": val.rows
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500)
        })
});


// создать новый борд
router.post("/create", parser, (req, res) => {
    pool.query(`
    INSERT INTO boards_olemika (name, creator) 
    VALUES ('${req.body.name}', ${req.body.id}) RETURNING *;
`)
        .then(val => {
            pool.query(`
                INSERT INTO boardUsers_olemika (board_id, user_id) 
                VALUES ('${val.rows[0].id}', ${req.body.id});`)
            res.status(200)
            res.send({
                "message": "Борд создан",
            })
        })
        .catch(err => {
            res.send({
                error: "Все плохо!",
                "message": err,
                "request": req.body
            })
        })
});


//Удаление борда
router.post("/delete", parser, (req, res) => {
    console.log(req.body)
    pool.query(`
             DELETE FROM boards_olemika WHERE id = ${req.body.id};
        `)
        .then(val => {
            console.log("ok")
            res.status(200)
            res.send({
                "message": "Борд удален"
            })
        })
        .catch(err => {
            console.log(err)
            res.send({
                error: "Все плохо!"
            })
        })
});


//получить борд по айди
router.get("/:id", parser, (req, res) => {
    console.log("получаем борд по айди")
    pool
        .query(`
        SELECT board.id as board_id, task.id as task_id, task.name as task_name, task.description as task_description, task.date_to as task_date_to, task.status as task_status, task.user_id as task_user_id, task.tag, users.name as task_user_name FROM boards_olemika board  
            LEFT OUTER JOIN tasks_olemika task ON task.board_id = board.id
            LEFT OUTER JOIN users_olemika users ON task.user_id = users.id
            WHERE board.id = ${req.params.id};
            `)
        .then(val => {
            if (val.rowCount === 0) {
                res.status(404)
                res.send({
                    error: "Борд не найден",
                })
            } else {
                pool.query(`SELECT * FROM statuses_olemika`).then(val2 => {
                    res.send({
                        "tasks": val.rows,
                        "statuses": val2.rows
                    })
                }).catch(err => console.log(err))
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500)
        })
});



//отредактировать борд (можно менять только имя)
router.post("/:id/update", parser, (req, res) => {
    console.log(`Редактируем имя борда. Реквест: ${req.body}`)
    pool
        .query(`
        UPDATE boards_olemika SET name = '${req.body.name}' WHERE id = ${req.params.id} RETURNING *;`)
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


//получить юзеров борда
router.get("/:id/users", parser, (req, res) => {

    pool
        .query(`
            SELECT users.id, users.name, users.login
            FROM users_olemika users
            LEFT OUTER JOIN boardusers_olemika bu ON bu.user_id = users.id
            LEFT OUTER JOIN boards_olemika board ON  board.id = bu.board_id
            WHERE board.id =  $1`, [req.params.id])
        .then(val => {

            if (val.rowCount === 0) {
                res.status(404)
                res.send({
                    error: "Что-то пошло не так. Возможно этого борда не существует",
                })
            } else {

                res.status(200)
                res.send(
                    val.rows
                )
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500)
        })
});

//добавить юзера к борду (доступ)
router.post("/:id/adduser", parser, (req, res) => {
    console.log(req.body);

    pool.query(`
            INSERT INTO boardusers_olemika (board_id, user_id) 
            VALUES (${req.params.id}, ${req.body.id}) RETURNING *;
        `)
        .then(val => {
            console.log(val.rows)
            res.status(200)
            res.send({
                "rows": val.rows,
                "code": res.statusCode,
                "message": "Юзер добавлен к борду",
            })
        })
        .catch(err => {
            if(err.code === '23505'){
            res.send({
                error: "Такой пользователь уже добавлен"
            })}
        })
});

//Удаление юзера от борда
router.post("/:id/removeuser", parser, (req, res) => {
    console.log(`Удаляем юзера. реквест ${req.body}`);

    pool.query(`
            DELETE FROM boardusers_olemika  
            WHERE board_id = ${req.params.id} AND user_id = ${req.body.id};
        `)
        .then(val => {
            pool.query(`
            UPDATE tasks_olemika SET user_id = (SELECT creator FROM boards_olemika WHERE id=${req.params.id}) WHERE board_id=${req.params.id} AND user_id =  ${req.body.id} RETURNING *;
        `).then(val1 => {
                res.status(200)
                res.send({
                    "rows": val1.rows,
                    "rows2": val.rows,
                    "code": res.statusCode,
                    "message": "Юзер лишен доступа к борду",
                })
            }).catch(err => { console.log(err) })
        })
        .catch(err => {
            console.log(err)
            res.send({
                error: "Все плохо!"
            })
        })
});




module.exports = router;
