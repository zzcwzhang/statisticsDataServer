const MongoClient = require('mongodb').MongoClient;
const test = require('assert');

const url = "mongodb://47.92.26.118:27017";
const dbName = 'tieba';


const getAll = new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('ty_gp');
        col.find().toArray( (err, items) => {
            if (err) reject(err);
            resolve(items);
            client.close();
        });
    });
});

const getFrom = from => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('ty_gp');
        col.find({'from': from}).toArray((err, items) => {
            if (err) reject(err);
            resolve(items);
            client.close();
        });
    });
});



module.exports = {
    getAll,
    getFrom
};
