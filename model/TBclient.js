/**
 * Created by zy on 2018/2/9.
 */
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://47.92.26.118:27017";
const dbName = 'tieba';

const insertDatas = datas => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('top1');
        col.insertMany(datas,(err,result) => {
            client.close();
            if (err) reject(err);
            resolve('insert success', result);
        });
    });
});

module.exports = {
    insertDatas,
};
