"use strict"

let db = require('./db');
let Sequelize = require('sequelize');

let Business = db.define('business', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
},
{
  freezeTableName: true
}
);
module.exports = Business;
