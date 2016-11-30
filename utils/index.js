"use strict"
const jwt = require('jsonwebtoken');
const Config = require('../config');
const bCrypt = require('bcrypt-nodejs');

exports.isValidPassword = function(user, password){
   return bCrypt.compareSync(password, user.password);
}

exports.createHash = function(password){
   return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

exports.generateToken = function(user) {
  var u = {
    id: user.id,
    userName: user.name,
    type: user.type
  };

  return jwt.sign(u, Config.key.privateKey, {
     expiresIn :  Config.key.tokenExpiry
  });
}

exports.getToken = function(req) {
  let token = undefined;
  if (req.body && req.body.token) {
    token = req.body.token;
  } else if (req.query && req.query.token) {
    token = req.query.token
  } else if (req.headers && req.headers['authorization']) {
    token = req.headers['authorization'];
  }
  if (token) {
     return token.replace('Bearer ', '')
  }
  return token;
}

exports.generateMailToken = function() {
  let salt = bCrypt.genSaltSync(15);

  return jwt.sign({key: salt}, Config.key.privateKey, {
     expiresIn :  Config.key.tokenExpiry
  });
}

exports.decodeToken = function(token, callback) {
  jwt.verify(token, Config.key.privateKey, callback);
}

exports.validateSignUpForm = function(values, callback) {
  var errors = {};
  var hasErrors = false;

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Не задано имя';
    hasErrors = true;
  }
  if (!values.email || values.email.trim() === '') {
    errors.email = 'Не задан email';
    hasErrors = true;
  }
  if (!values.password || values.password.trim() === '') {
    errors.password = 'Не задан пароль';
    hasErrors = true;
  }
  if (!values.confirmPassword || values.confirmPassword.trim() === '') {
    errors.confirmPassword = 'Не задан подтверждающий пароль';
    hasErrors = true;
  }

  if (values.confirmPassword && values.confirmPassword.trim() !== '' && values.password && values.password.trim() !== '' && values.password !== values.confirmPassword) {
    errors.password = 'Пароль и подтерждающий пароль не совпадают';
    hasErrors = true;
  }

  if (callback) {
    callback(hasErrors && errors);
  } else {
    return hasErrors && errors;
  }
}

exports.getCleanUser = function(user) {
  var u = user.toJSON();
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    type: u.type,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    isVerified: u.isVerified
  }
}
