const express = require("express");
const port =  process.env.PORT || 5050;
const parser = require("body-parser").json();
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));


app.use(express.static("./public"));
app.use("/api/user", require("./routes/user"));
app.use("/api/board", require("./routes/board"));
app.use("/api/task", require("./routes/task"));


app.listen(port);