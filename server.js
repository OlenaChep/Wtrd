"use strict"
const http = require('http');
const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Config = require('./config');


(function initWebpack() {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack/common.config');
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
  }));

  app.use(express.static(__dirname + '/'));
  app.use('/static', express.static(__dirname + '/src/images'));
})();

app.set('superSecret', Config.key.privateKey);
// use body parser so we can get info from POST and/or URL parameters
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  //
  //console.log('BODY:' + req.body);
  //console.log('QUERY' + req.query);
  //console.log('headers' + req.headers['authorization']);
  let token = undefined;
  if (req.body && req.body.token) {
    token = req.body.token
  } else if (req.query && req.query.token) {
     token = req.query.token
  } else if (req.headers && req.headers['authorization']) {
    /*for (let key in req.headers) {
      console.log(key + ' = ' + req.headers[key]);
    }*/
    token = req.headers['authorization'];
  }
  //var token = req.body.token || req.query.token || req.headers['authorization'];

  // decode token
  console.log('token= '+ token);
  if (token) {
      console.log('mdlw token');
      jwt.verify(token.replace('Bearer ', ''), app.get('superSecret'), function(err, user) {
      if (err) {
        console.log('mdlw token error');
        return res.status(401).json({ success: false, message: 'Ошибка аутентификации ключа'});
      } else {
        console.log('mdlw token success');
        req.user = user;
        next();
      }
    });
  } else {
    next();
  }
});

app.get(/.*/, function root(req, res) {
  res.sendFile(__dirname + '/index.html');
});

const router = require('./routes/index_')(app);
app.use('/', router);
//let apiRoutes = require('./routes/index');
//app.use('/', apiRoutes);

/*let router = require('express').Router();
app.use('/', router);

// parse application/json
router.use(bodyParser.json());

router.post('/login', update);

function update(req, res) {
  console.log('updating-', req.body);
  res.sendStatus(200);
}*/

const server = http.createServer(app);
server.listen(process.env.PORT || 3000, function onListen() {
  const address = server.address();
  console.log('Listening on: %j', address);
  console.log(' -> that probably means: http://localhost:%d', address.port);
});
