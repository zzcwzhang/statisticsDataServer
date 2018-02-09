const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const webdriver = require('selenium-webdriver');
const path = require('chromedriver').path;
const cheerio = require('cheerio');
const url = require('url');
const mydb = require('./model/TBclient');

const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);
//
const TagUrl = 'http://bbs.tianya.cn/post-stocks-1131734-1.shtml';
const urlObj = url.parse(TagUrl);
const hostUrl = `${urlObj.protocol}//${urlObj.host}`;
// console.log(urlObj);

// const $ = cheerio.load(`<div><p>heel</p></div>`);
// console.log($('div').html());

const getNextUrl = html => new Promise( (resolve) => {
    const $ = cheerio.load(html);
    const next = $('.js-keyboard-next');
    const url = next.attr('href');
    resolve(url);
});

const getPageInfo = html => new Promise( (resolve) => {
    const res = [];
    const $ = cheerio.load(html);
    const children = $('.atl-item');
    children.each( (i, elem) => {
        const name = $(elem).attr('js_username');
        const time = $(elem).attr('js_restime');
        const id = $(elem).attr('replyid');
        const context = $(elem).find('.bbs-content').text().trim();
        // console.log(name, " Time: ",time, " say: ",context);
        res.push({
            id,
            name,
            time,
            context
        })
    });

    mydb.insertDatas(res);
    // console.log(res);
    // resolve(res);
}) ;


const Bug = async function(TagUrl, max, handler){
    let driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()) .build();
    const maxStep = max;
    let i =0;
    let html = '';
    const urlObj = url.parse(TagUrl);
    const hostUrl = `${urlObj.protocol}//${urlObj.host}`;
    let nurl =  urlObj.path;
    while (i<maxStep) {
        // 读取页面
        try {
            await driver.get(hostUrl + nurl);
            // // 等待下一页的资源加载完成
                driver.wait(until.elementLocated(By.xpath(`//a[@href='${nurl}' and @class='js-keyboard-next']`))).catch(
                    err => {return}
                );
            // 获取下一页(重新赋值)
            try {
                // 获取html
                html = await driver.getPageSource();
                try {
                    nurl = await getNextUrl(html);
                } catch (err) {
                    console.log(nurl, ' 获取下一页失败');
                }
            } catch (err) {
                console.log(err, " ", nurl, ' 获取html 失败');
            }
            // 处理
            handler(html);
            // 下一次循环
        } catch (err) {
            console.log(nurl, "读取失败");
        } finally {
            i++;
        }
    }
    driver.quit();
    console.log('!!!!!!!!!!!!!!!!!!!!!');
};

Bug(TagUrl, 3, getPageInfo);

// //*[@id="bd"]/div[5]/div[1]/form/a[7]
//	<div class="atl-item" _host="天缘329415788" id="55" replyid="3001950" _hostid="50678760" js_username="天缘329415788" js_restime="2013-07-29 17:21:59">
