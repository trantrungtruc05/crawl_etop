import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as controller from './controller';
import connection from './db/connection';
import * as crawlService from './service/crawlItemService';
var cron = require('node-cron');

const app: Express = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.route("/crawl/:category").get(controller.crawl);

// start cron job
cron.schedule('*/2 * * * * *', async () => {
      crawlService.crawlItem('csgo');
});

cron.schedule('*/3 * * * * *', async () => {
  crawlService.crawlItem('dota');
});

app.listen(port, async() => {
  await connection.sync();
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});