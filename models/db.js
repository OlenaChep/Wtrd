"use strict"
const Config = require('../config');
let Sequelize = require("sequelize");
let sequelize = new Sequelize(
  Config.db.database,
  Config.db.username,
  Config.db.password,
  Config.db.options
  );

module.exports = sequelize;
