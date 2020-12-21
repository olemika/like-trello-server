const {Pool} = require("pg");

// const client = new Client({
//

// user: "wljidrdpmalila",
// host: "ec2-54-217-224-85.eu-west-1.compute.amazonaws.com",
// database: "db3a6g2887sbgj",
// password: "c8be93675df7cefde59635efaaf7c281fcc4246ed7caedf3a730b6654b6e9c72",
// port: 5432,
// });

const pool = new Pool({
     user: "student",
    host: "188.225.78.173",
    database: "ithub_pg",
    password: "ithub2020",
    port: 5432,
    max: 20,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0
});

module.exports = pool;

