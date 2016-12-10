"use strict"

let controllerNews = require('../controllers/news');
let controllerProduct = require('../controllers/product');
let controllerOrder = require('../controllers/order');
let expressJwt = require('express-jwt');

const bodyParser = require('body-parser');
let router = require('express').Router();
router.use(bodyParser.json());

router.get('/news/:id([0-9]+)', controllerNews.getNewsById);
router.get('/news/cnt', controllerNews.getNewsCount);
router.get('/news', controllerNews.getNews);

router.get('/ggroups/:id([0-9]+)/goodsAll', controllerProduct.getGGroupGoods);
router.get('/ggroups/:id([0-9]+)/goodsAll/cnt', controllerProduct.getGGroupGoodsCnt)
router.get('/ggroups', controllerProduct.getGGroup);

router.get('/orders', expressJwt({secret: process.env.JWT_SECRET}), controllerOrder.getOrders);
router.get('/orders/:id([0-9]+)/order_spec', expressJwt({secret: process.env.JWT_SECRET}), controllerOrder.getOrderSpec);


module.exports = router;
