const express = require('express');
const dbApi = require('./model/mongodata');
const app = express();

app.get('/all.do', (req, res) => {
    dbApi.getAll.then( (json) => {
        res.json(json)
    });
});

const server = app.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Express app listening at http://%s:%s', host, port);
});