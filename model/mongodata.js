const MongoClient = require('mongodb').MongoClient;
const test = require('assert');

const url = "mongodb://60.205.185.67:27017";
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
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.find().toArray( (err, items) => {
            if (err) reject(err);
            client.close();
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
            client.close();
            if (err) reject(err);
            resolve('insert success', result);
        });
    });
});

// addTheme('tttt');

// 删除主题
const removeTheme = theme => new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.removeOne({'name': theme},(err, result) => {
            client.close();
            if (err) reject(err);
            resolve('delete success', result);
        })
    })
});

// removeTheme('tttt');


//给主题添加关键字
const addKeyWord = (theme, keyword) => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.updateOne({'name': theme},{'$addToSet':{'keywords':keyword}},[true,true],(err, result) => {
            client.close();
            if (err) reject(err);
            resolve('insert key success', String(result));
        });
    });
});

//给主题添加过滤字
const addFilterWord = (theme, filterword) => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.updateOne({'name': theme},{'$addToSet':{'filterwords':filterword}},[true,true],(err, result) => {
            client.close();
            if (err) reject(err);
            resolve('insert filter success', String(result));
        });
    });
});

// 删除关键字 即使没有也不会报错
const removeKeyword = (theme, word) => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.updateOne({'name': theme},{'$pull':{'keywords':word}},(err, result) => {
            client.close();
            if (err) reject(err);
            resolve('delete key success', String(result));
        })
    });
});

// removeKeyword('数据分析','指数').then(res=>{
//     console.log(res);
// });

// 删除过滤字 即使没有也不会报错
const removeFilterword = (theme, word) => new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        const col = client.db(dbName).collection('theme');
        col.updateOne({'name': theme},{'$pull':{'filterwords':word}},(err, result) => {
            client.close();
            if (err) reject(err);
            resolve('delete filter success', String(result));
        })
    });
});

// removeFilterword('货币','股').then(res=>{
//     console.log(res);
// });

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
    removeTheme,
    addKeyWord,
    removeKeyword,
    addFilterWord,
    removeFilterword,
    getFilterByTheme,
    getBytheme
};
