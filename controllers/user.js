"use strict"
const db = require('../models/db');
//let Order = require('../models/Order');
let User = require('../models/user');
let dbCore = require('../models/Core').dbCore;
const utils = require('../utils/index');
const email = require('../utils/email');
const jwt = require('jsonwebtoken');

exports.login = function(req, res) {
  let userName = req.body.name;
  let password = req.body.password;

  User.findOne({ where: {name: userName} })
      .then((user) => {
        if (!user) {
          console.log('User Not Found with username '+ userName);
          res.status(403).json({success: false, user: null, message: 'Пользователь с именем ' + userName + ' не найден'})
        } else if (!utils.isValidPassword(user, password)){
          console.log('Invalid Password');
          res.status(403).json({success: false, user: null, message: 'Неверный пароль'});
        }  else {
          console.log('USER exist:'+ user.name);
          let token = utils.generateToken(user);
          res.status(200).json({
                success: true,
                user: utils.getCleanUser(user),
                message: (!user.isVerified? 'Подтвердите Email': 'Авторизация успешна'),
                token: token
          });
       }
    });
}

exports.signup = function(req, res) {
  let userName = req.body.name;
  let password = req.body.password;
  let userEmail = req.body.email;
  let type = 1;

  User.findOne(
    {where: {
      $or: [
       {name: userName},
       {email: userEmail}
      ]}
    })
  .then((user) => {
    if (user) {
      if (user.name.toUpperCase() === userName.toUpperCase()) {
        console.log('User already exists with username: ' + userName);
        res.status(403).json({success: false, user: null, message: 'Пользователь с именем '+ userName + ' уже существует'});
      } else {
        console.log('User already exists with email: ' + userEmail);
        res.status(403).json({success: false, user: null, message: 'Пользователь с email '+ userEmail + ' уже существует'});
      }
    } else {
      let emailToken = utils.generateMailToken();
      User.create({
          name: userName,
          password: utils.createHash(password),
          email: userEmail,
          type: 1,
          isVerified: false,
          emailToken: emailToken
          })
      .then((newUser) => {
          console.log('User created successful');
          let token = utils.generateToken(newUser);
          email.sendMailVerificationLink(newUser, emailToken, function(error, response) {
            if (error) {
              res.status(200).json({
                 success: false,
                 user: utils.getCleanUser(newUser),
                 message: 'Ваши данные сохранены. Ошибка отправки email: ' + error.message,
                 token: token
                 });
            } else {
              res.status(200).json({
                 success: true,
                 user: utils.getCleanUser(newUser),
                 message: newUser.name  + 'подтвердите email',
                 token: token
                 });
            }
          });
      })
      .catch(function(error) {
        console.log('Error creating user ' + error);
        return res.status(500).json(success:false, user:null, message: error.message);
      })
    }
  })
}

exports.validateEmail = function(req, res) {
  let token = req.params.token;
  if (!token) {
    console.log('Email must content token');
    return res.status(401).json({
      success: false,
      user: null,
      message: 'Email должен содержать ключ'
    });
  }
  utils.decodeToken(token, function(err, decoded) {
    if (err || (decoded === undefined)) {
      console.log('Email token is not valid or has expired');
      return res.status(401).json({
        success: false,
        user: null,
        message: 'Инвалидный ключ или время ключа истекло.'
      });
    }
    User.findOne({
      where: {
        emailToken: token
      }
    })
    .then((user) => {
      if (!user) {
        console.log('Invalid token. User emailToken=' + token + ' not found');
        return res.status(401).json({
          success: false,
          user: null,
          message: 'Инвалидный ключ. Пользователь не найден.'
        });
      }
      user.isVerified = true;
      user.emailToken = null;
      user.save()
          .then(function() {
            console.log('Email sucessfully verified');
            return res.status(200).json({
              success: true,
              user: utils.getCleanUser(user),
              message: 'Email успешно подтвержден',
              token:  utils.generateToken(user)
            });
          })
          .catch(function(error) {
            console.log('Error^:' + error);
            return res.status(500).json(success:false, user:null, message: error.message);
          });
    })
    .catch(function(error) {
      console.log('Error^: ' + error);
      return res.status(500).json(success:false, user:null, message: error.message);
    });
  })
}

exports.resendValidationEmail = function(req, res, next) {
  let userId = req.user.id;
  User.findById(userId)
      .then(user => {
         if (!user) {
           console.log('User id=' + req.body.id + ' not found');
           return res.status(404).json({success: false, message: 'Пользователь не найден'});
         }
         user.isVerified = false;
         let emailToken = utils.generateMailToken();
         user.emailToken = emailToken;
         user.save()
             .then(function() {
                 console.log('User isVerified set to false');
                 email.sendMailVerificationLink(user, emailToken, function(error, response) {
                 if (error) {
                   res.status(403).json({
                      success: false,
                      message: 'Ошибка отправки email: ' + error.message
                      });
                 } else {
                   res.status(200).json({
                      success: true,
                      message: 'Письмо отправлено',
                      });
                 }
               })
             })
             .catch(function(error) {
               console.log('Error^: ' + error);
               return res.status(500).json({success:false, message: error.message});
             })
      })
      .catch(function(error) {
        console.log('Error^: ' + error);
        return res.status(500).json({success:false, message: error.message});
      })
}

exports.meFromToken = function(req, res) {
  console.log('Attemp recognize user from token ='||token);
  let token = utils.getToken(req);
  if (!token) {
    console.log('Token is empty');
    return res.status(401).json({
      success: false,
      user: null,
      message: 'Ключ не определен'
    });
  }
  utils.decodeToken(token, function(err, decoded) {
    if (err || (decoded === undefined)) {
      console.log('Token is not valid or has expired');
      return res.status(401).json({
        success: false,
        user: null,
        message: 'Инвалидный ключ или время ключа истекло.'
      });
    }
    User.findById(decoded.id)
    .then((user) => {
      if (!user) {
        console.log('Invalid token. User id=' + decoded.id + ' not found');
        return res.status(401).json({
          success: false,
          user: null,
          message: 'Инвалидный ключ. Пользователь не найден.'
        });
      }
      let newToken = utils.generateToken(user);
      res.status(200).json({
            success: true,
            user: utils.getCleanUser(user),
            message: (!user.isVerified? 'Подтвердите Email': 'Авторизация успешна'),
            token: newToken
      });
    })
    .catch(function(error) {
      console.log('Error^: ' + error);
      return res.status(500).json(success:false, user:null, message: error.message);
    });
  })
}
