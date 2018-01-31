const express = require('express');
const cors = require('cors');
const dbApi = require('./model/mongodata');
const app = express();

app.use(cors());
//设置跨域访问
app.get('/all.do', (req, res) => {
    dbApi.getAll.then( (json) => {
        res.json(json)
    });
});

app.get('/scan/:from', (req, res) => {
    let from = req.params.from;
    dbApi.getFrom(from).then(json=>{
        res.json(json)
    });
});

app.get('/theme/all.do', (req, res) => {
    dbApi.getThemes().then( json => {
        res.json(json);
    })
});

app.get('/theme/add/:name', (req, res) => {
    let name = req.params.name;
    dbApi.addTheme(name).then( json => {
        res.json({
            success: true
        });
    }).catch( err => {
        res.json({
            success: false,
            info: err
        });
    })
});

app.get('/theme/add/:name/:keyword', (req, res) => {
    let name = req.params.name;
    let keyword = req.params.keyword;
    dbApi.addKeyWord(name, keyword).then( json => {
        res.json({
            success: true,
            info: json
        });
    }).catch( err => {
        res.json({
            success: false,
            info: err
        });
    })
});
app.get('/theme/filter/:name/:keyword', (req, res) => {
    let name = req.params.name;
    let keyword = req.params.keyword;
    dbApi.addFilterWord(name, keyword).then( json => {
        res.json({
            success: true,
            info: json
        });
    }).catch( err => {
        res.json({
            success: false,
            info: err
        });
    })
});

app.get('/theme/scan/:name', (req, res) => {
    let name = req.params.name;
    dbApi.getBytheme(name).then(json=>{
        dbApi.getFilterByTheme(name).then(
            //过滤数组
            filters => {
                //将过滤数组变成正则
                const reg = `(${filters.join('|')})`;
                const regx = new RegExp(reg);
                json = json.filter( item =>!(regx.test(item.name)));
                res.json(json)
            }
        ).catch(()=>res.json(json));
    }).catch( error => {
        res.json({})
    });
});
const server = app.listen(3001, function () {
    const host = server.address().address || 'localhost';
    const port = server.address().port;
    console.log('Express app listening at http://%s:%s', host, port);
});