import { Request, Response } from 'express';
import axios from 'axios';
import { ConfigInfo } from './entity/ConfigInfo';
import { EtopItemPage } from './entity/EtopItemPage';
var cron = require('node-cron');

export let crawlItem = async (req, res) => {


    cron.schedule('*/3 * * * * *', async () => {
    const { category } = req.params;
    console.log(`CRAWL ${category}`);

    var proxyLisy = ['45.131.212.199:6248', '45.131.212.96:6145', '45.131.212.239:6288', '45.131.212.154:6203', '45.131.212.54:6103', '45.131.212.147:6196', '45.131.212.134:6183', '45.131.212.230:6279', '45.131.212.8:6057', '45.131.212.223:6272'
        , '45.131.212.243:6292', '45.131.212.110:6159', '45.131.212.139:6188', '45.131.212.116:6165', '45.131.212.164:6213', '45.131.212.196:6245', '45.131.212.250:6299', '45.131.212.228:6277', '45.131.212.240:6289', '45.131.212.211:6260']

    var proxy = proxyLisy[Math.floor(Math.random() * proxyLisy.length)];
    console.log(`Using proxy to crawl ${category}` + proxy);

    const cookieEtopCrawlItem: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "asimovet1", type: "etop_crawl" } });
    const etopCurrency: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "etop", type: "currency" } });

    var totalPageLink = category == 'csgo' ? 'https://www.etopfun.com/api/ingotitems/realitemback/list.do?appid=730&page=1&rows=60&lang=en' : 'https://www.etopfun.com/api/ingotitems/realitemback/list.do?appid=570&page=1&rows=60&lang=en';

    var result = await axios.get(totalPageLink, {
        proxy: {
            host: `${proxy.split(':')[0]}`,
            port: parseInt(proxy.split(':')[1]),
            auth: { username: 'dmogyuzp', password: 'lx8fr8go05bq' }
        },
        headers: {
            'content-type': 'application/json',
            'Cookie': cookieEtopCrawlItem[0].value
        }
    });

    if (result.data === '') {
        console.log('failed');
    } else {
        var page = 1;
        var etopItemLs:any[]  = [];
        // while (page <= result.data.datas.pager.pages) {
           while (page <= 1) {
            var getItemLink = category == "csgo" ? `https://www.etopfun.com/api/ingotitems/realitemback/list.do?appid=730&page=${page}&rows=60&lang=en` : `https://www.etopfun.com/api/ingotitems/realitemback/list.do?appid=570&page=${page}&rows=60&lang=en`;
            var resultGetItem = await axios.get(getItemLink, {
                proxy: {
                    host: `${proxy.split(':')[0]}`,
                    port: parseInt(proxy.split(':')[1]),
                    auth: { username: 'dmogyuzp', password: 'lx8fr8go05bq' }
                },
                headers: {
                    'content-type': 'application/json',
                    'Cookie': cookieEtopCrawlItem[0].value
                }
            })

            console.log(">>>>>>> crawling etop item with page: " + page);

            for (let i = 0; i < resultGetItem.data.datas.list.length; i++) {
                var priceByVnd = resultGetItem.data.datas.list[i].value * parseInt(etopCurrency[0].value);
                var item = { createAt: new Date(), name: resultGetItem.data.datas.list[i].pop.topName.tag, originalPrice: resultGetItem.data.datas.list[i].value, priceByVnd: Math.round(priceByVnd), category: category, idItem: resultGetItem.data.datas.list[i].id, quantity: resultGetItem.data.datas.list[i].num }
                etopItemLs.push(item);

            }

            page++;
        }

        await EtopItemPage.destroy({ where: {}, truncate: true });

        await EtopItemPage.bulkCreate(etopItemLs);
        console.log('Insert DB done');

    }
    // var result = await axios.get('https://api.ipify.org?format=json', {
    //     proxy: {
    //         host: `${proxy.split(':')[0]}`,
    //         port: parseInt(proxy.split(':')[1]),
    //         auth: { username: 'dmogyuzp', password: 'lx8fr8go05bq' }
    //     }
    // });
    });


    return res.status(200).send('crawl');
};