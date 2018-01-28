const mysql = require('mysql');

const mysqlConfig = {
    host:'47.92.26.118',
    user:'zy',
    password:'123456',
    database:'tieba'
};

const getTyGp = new Promise( (resolve, reject) => {
    const conn = mysql.createConnection(mysqlConfig);
    const sqltest = "SELECT * FROM `ty_gp` ORDER BY (ansCount/readCount) desc;";
    conn.connect();
    conn.query(sqltest,function(error, results) {
        if (error) reject(error);
        resolve(results);
    });
    conn.end();
});

module.exports = {
    getTyGp
};
