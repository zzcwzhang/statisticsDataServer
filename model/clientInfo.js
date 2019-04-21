const MongoClient = require('mongodb').MongoClient;

const moment = require('moment');

const url = "mongodb://60.205.185.67:27017";
const dbName = 'clientInfo';

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

//添加主题
const addClient = (req) => new Promise( (resolve, reject) => {
    return;
    const IP = getClientIp(req);
    const timestamp = Date.parse(new Date());
    const now = moment().format('YYYY年MM月DD日 hh:mm');
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('babaData');
        col.insert({'client': IP,'time': timestamp,'url':req.path,'timeFormat': now},(err, result) => {
            client.close();
            if (err) reject(err);
            resolve(true);
        });
    });
});

module.exports = {
    addClient,
};
