"use strict"
const Config = require('../config');
let Sequelize = require("sequelize");
let sequelize = new Sequelize(
  Config.db.database,
  Config.db.username,
  Config.db.password,
  Config.db.options
  );

//module.exports.Sequelize = Sequelize;
module.exports = sequelize;
/*  sequelize
    .authenticate()
    .then(function(err) {
      console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
      console.log('Unable to connect to the database:', err);
    });*/
