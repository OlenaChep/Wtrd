"use strict"

let db = require('./db');
let Sequelize = require('sequelize');
let Business = require('./Business');
let Contractor = require('./Contractor');
let User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  emailToken: {
    type: Sequelize.STRING
  }
},
{
  freezeTableName: true,
  classMethods: {
    isClient: function(userType) { return userType === 1;},
    isManager: function(userType) { return userType === 2;},
    isAdmin: function(userType) { return userType === 0;}
  },
  instanceMethods: {
    isClient: function() { return this.type === 1;},
    isManager: function() { return this.type === 2;},
    isAdmin: function() {return this.type === 0;}
  }
}
);
User.belongsToMany(Business, {through: 'UserBusiness'});
Business.belongsToMany(User, {through: 'UserBusiness'});

User.belongsToMany(Contractor, {through: 'UserContractor'});
Contractor.belongsToMany(User, {through: 'UserContractor'});

module.exports = User;
