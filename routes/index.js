"use strict"
let express = require('express');
let apiRoutes = express.Router();
let db = require('../models/db');
let Order = require('../models/Order');
let dbCore = require('../models/Core').dbCore;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

module.exports = function() {
	apiRoutes.use(bodyParser.json());

	apiRoutes.post('/login', function(req, res) {

		    res.sendStatus(200);

		//console.log('aaaaaaaaaaa');
		//res.sendStatus(403);
		/*let userName = req.body.name;
		let password = req.body.password;

		let isValidPassword = function(user, password){
			 return bCrypt.compareSync(password, user.password);
		}

    User.findOne({ where: {name: userName} })
		    .then((user) => {
						if (!user) {
							console.log('User Not Found with username '+username);
							res.status(403).json({success: false, message: 'Пользователь с именем ' + userName + ' не найден'})
						} else if (!isValidPassword(user, password)){
							console.log('Invalid Password');
							res.status(403).json({success: false, message: 'Неверный пароль'}); // redirect back to login page
				    } else {
						  console.log('USER exist:'+ user.name);
							let token = jwt.sign({userName: user.name}, app.get('superSecret'), {
                expiresInMinutes: 1440 // expires in 24 hours
              });
							res.status(200).json({
                  success: true,
                  message: 'Авторизация успешна',
                  token: token
              });
					 }
				});*/
	});


	/*apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
    if (token) {

    // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.status(403).json({success: false, message: 'Не удалось проверить подлинность ключа.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {

    // if there is no token
    // return an error
      return res.status(403).send({
          success: false,
          message: 'Ключ не предоставлен.'
      });
    }
  });*/

	return apiRoutes;
}
