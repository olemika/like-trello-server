const express = require("express");
const port =  process.env.PORT || 4000;
const parser = require("body-parser").json();
const app = express();


app.use(express.urlencoded({
    extended: true
}));

app.use("/api/user", require("./routes/user"));
app.use("/api/board", require("./routes/board"));
app.use("/api/task", require("./routes/task"));
/* 
REST 
CRUD 
create = POST
Read = GET
Update = PUT
Delete = DELETE
*/

// app.get("/", (req, res) => {
//     /* 
//     req = request
//     res = response
//      */
    
//     res.send("Hellow");
//     // res.end();

// });

app.listen(port);