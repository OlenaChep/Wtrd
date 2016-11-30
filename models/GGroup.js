"use strict"

let db = require('./db');
let Sequelize = require('sequelize');
require('sequelize-hierarchy')(Sequelize);

let GGroup = db.define('goods_groups', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  } }
);
GGroup.isHierarchy();

/*Contractor.sync().then(function() {

Contractor.addNew('Bce', null).then(function(contractor) {
  Contractor.addNew('Contr1', 3);
})*/
module.exports = GGroup;
