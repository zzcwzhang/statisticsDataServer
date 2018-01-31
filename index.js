const express = require('express');
const cors = require('cors');
const dbApi = require('./model/mongodata');
const app = express();

//设置跨域访问
app.use(cors());

// 获取所有数据
app.get('/all.do', (req, res) => {
    dbApi.getAll.then( (json) => {
        res.json(json)
    });
});

// 根据来源获取数据
app.get('/scan/:from', (req, res) => {
    let from = req.params.from;
    dbApi.getFrom(from).then(json=>{
        res.json(json)
    });
});

// 获取所有主题
app.get('/theme/all.do', (req, res) => {
    dbApi.getThemes().then( json => {
        res.json(json);
    })
});

// 添加主题
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

// 删除主题
app.del('/theme/:name', (req, res) => {
    let name = req.params.name;
    dbApi.removeTheme(name).then( json => {
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

// 添加关键字
app.get('/theme/key/:name/:keyword', (req, res) => {
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

// 添加过滤字
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

// 删除关键字或过滤字
app.del('/word/:themename/:word', (req, res) => {
    let theme = req.params.themename;
    let word = req.params.word;
    dbApi.removeFilterword(theme, word);
    dbApi.removeKeyword(theme, word);
    res.json({
        info: 'finish'
    })
});


// 根据主题查询数据
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