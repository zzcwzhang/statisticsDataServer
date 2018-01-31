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
            client.close();
            resolve(items);
        });
    });
});

// getAll.then( res => console.log(res));

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

const getThemes = () => new Promise( (resolve, reject) => {
    console.log('getThemes');
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.find().toArray( (err, items) => {
            if (err) reject(err);
            client.close();
            console.log(items);
            resolve(items);
        })
    })
});

// getThemes.then( res=>{
//     console.log(res)
// });

//添加主题
const addTheme = theme => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.insert({'name': theme},(err, result) => {
            if (err) reject(err);
            resolve('insert success', result);
            client.close();
        });
    });
});

// addTheme('主题测试');

//给主题添加关键字
const addKeyWord = (theme, keyword) => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.updateOne({'name': theme},{'$addToSet':{'keywords':keyword}},[true,true],(err, result) => {
            if (err) reject(err);
            resolve('insert key success', String(result));
            client.close();
        });
    });
});

//给主题添加过滤字
const addFilterWord = (theme, filterword) => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.updateOne({'name': theme},{'$addToSet':{'filterwords':filterword}},[true,true],(err, result) => {
            if (err) reject(err);
            resolve('insert filter success', String(result));
            client.close();
        });
    });
});

//根据主题查询过滤字段
const getFilterByTheme = theme => new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const themeCol = client.db(dbName).collection('theme');
        themeCol.findOne({'name': theme},function (err, result) {
            if (err) reject(err);
            if (result) {
                const filterwords = result.filterwords;
                if (filterwords) {
                    client.close();
                    resolve(filterwords);
                } else {
                    client.close();
                    reject(null)
                }
            } else {
                client.close();
                reject(null)
            }
        });
    });
});

// getFilterByTheme('数据分析').then( res => {
//     console.log(res);
// }).catch( err => console.log(err));

//根据主题查询数据
const getBytheme = theme => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const themeCol = client.db(dbName).collection('theme');
        themeCol.findOne({'name': theme},function (err, result) {
            if (err) reject(err);
            try{
                const keywords = result.keywords;
                if (keywords) {
                    const reg = `(${keywords.join('|')})`;
                    const col = client.db(dbName).collection('ty_gp');
                    col.find({'name':{'$regex':reg}}).toArray( (err, items) => {
                        if (err) reject(err);
                        client.close();
                        resolve(items);
                    });
                } else {
                    client.close();
                    reject('10001');
                }
            }catch(error) {
                client.close();
                reject(error);
            }
        });
    });
});

// getBytheme('数据分析').then( res=>{
//     console.log(res);
// });


module.exports = {
    getAll,
    getFrom,
    addTheme,
    getThemes,
    addKeyWord,
    addFilterWord,
    getFilterByTheme,
    getBytheme
};
