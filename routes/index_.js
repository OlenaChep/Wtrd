"use strict"
let expressJwt = require('express-jwt');
let controllerUser = require('../controllers/user');
let controllerOrder = require('../controllers/order');
let controllerNews = require('../controllers/news');
let controllerProduct = require('../controllers/product');

const bodyParser = require('body-parser');
let router = require('express').Router();
router.use(bodyParser.json());

module.exports = function(app){

router.post('/api/login', controllerUser.login);
router.post('/api/signup', controllerUser.signup);
router.post('/api/resendValidationEmail', controllerUser.resendValidationEmail);
router.post('/api/validateEmail/:token', controllerUser.validateEmail);
router.post('/api/meFromToken', controllerUser.meFromToken);
router.post('/api/orders', controllerOrder.getOrders);
router.post('/api/orders/:id([0-9]+)/order_spec', controllerOrder.getOrderSpec);
router.post('/api/news', controllerNews.getNews);
router.post('/api/news/page/:id([0-9]+)', controllerNews.getNews);
router.post('/api/news/:id([0-9]+)', controllerNews.getNewsById);
router.post('/api/news/cnt', controllerNews.getNewsCount);
router.post('/api/ggroups', controllerProduct.getGGroup);
router.post('/api/ggroups/:id([0-9]+)/goodsAll', controllerProduct.getGoods);
router.post('/api/ggroups/:id([0-9]+)/goodsAll/page/:page([0-9]+)', controllerProduct.getGoods);
router.post('/api/ggroups/:id([0-9]+)/cnt', controllerProduct.getGoodsCnt)

return router;
}
