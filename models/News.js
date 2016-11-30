"use strict"

let db = require('./db');
let Sequelize = require('sequelize');

let News = db.define('news', {
  releaseDate: {
    type: Sequelize.DATEONLY
  },
  caption: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  text: {
    type: Sequelize.STRING(1000)
  },
  fullText: {
    type: Sequelize.TEXT
  }
},
{
  freezeTableName: true
}
);
module.exports = News;
