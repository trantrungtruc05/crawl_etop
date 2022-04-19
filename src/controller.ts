import { Request, Response } from 'express';
import * as crawlService from './service/crawlItemService';

export let crawl = async (req, res) => {

    const { category } = req.params;
    crawlService.crawlItem(category);
    return res.status(200).send('crawl');
};