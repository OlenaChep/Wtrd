"use strict"
let controllerUser = require('../controllers/user');

const bodyParser = require('body-parser');
let router = require('express').Router();
router.use(bodyParser.json());

router.post('/login', controllerUser.login);
router.post('/signup', controllerUser.signup);
router.post('/resendValidationEmail', controllerUser.resendValidationEmail);
router.post('/validateEmail/:token', controllerUser.validateEmail);
router.get('/meFromToken', controllerUser.meFromToken);

module.exports = router;
