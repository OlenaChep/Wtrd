"use strict"

let db = require('./db');
let Contractor = require('./Contractor');
let Business = require('./Business');
let Sequelize = require('sequelize');
let User = require('./User');

let OrderPr = db.define('order_pr', {
  releaseDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  realDate: {
    type: Sequelize.DATEONLY
  },
  finalDate: {
    type: Sequelize.DATEONLY
  },
  delivery_type: {type: Sequelize.STRING},
  delivery_point: {type: Sequelize.STRING(1000)},
  currency: {type: Sequelize.STRING},
  rate: {type: Sequelize.DOUBLE},
  total_sum: {type: Sequelize.DOUBLE},
  phase: {type: Sequelize.INTEGER(3)},
  work_scheme: {type: Sequelize.STRING}
},
{
  freezeTableName: true,
  classMethods: {
    setUser: function(id, userType) {
      if (User.isClient(userType)) {
        OrderPr.addScope('defaultScope', {
               where: {
                $and: [['order_pr.contractorId IN (SELECT contractorId from usercontractor WHERE userId = ?)', id],
                       ['order_pr.businessId IN (SELECT businessId from userbusiness WHERE userId = ?)', id]]
               }
             }, {override: true});
      } else if(User.isManager(userType)) {
        OrderPr.addScope('defaultScope', {
              where: {
               $and: [['order_pr.managerId IN (SELECT contractorId from usercontractor WHERE userId = ?)', id],
                      ['order_pr.businessId IN (SELECT businessId from userbusiness WHERE userId = ?)', id]]
              }
            }, {override: true});
      } else if(User.isAdmin(userType)) {
        OrderPr.addScope('defaultScope', {}, {override: true});
      } else {
        OrderPr.addScope('defaultScope', {where: {id: -1}}, {override: true});
        //throw Error('Тип пользователя #' + user.type + ' не описан');
      }
    }
  }
}
);
Contractor.hasMany(OrderPr, {as: 'Contractor', foreignKey: 'contractorId'});
Contractor.hasMany(OrderPr, {as: 'Manager', foreignKey: 'managerId'});
OrderPr.belongsTo(Contractor);

Business.hasMany(OrderPr);
OrderPr.belongsTo(Business);

let OrderSpec = db.define('order_spec', {
  goods: {type: Sequelize.STRING},
  quantity: {type: Sequelize.DOUBLE},
  price: {type: Sequelize.DOUBLE},
  sum_: {type: Sequelize.DOUBLE}
},
{
    freezeTableName: true
});
OrderPr.hasMany(OrderSpec, { as: 'OrderSpec' });
OrderSpec.belongsTo(OrderPr);
//db.sync({force: true});

//Sequelize.sync({ force: true });

/*Contractor.sync().then(function() {

Contractor.addNew('Bce', null).then(function(contractor) {
  Contractor.addNew('Contr1', 3);
})*/
module.exports.OrderPr = OrderPr;
module.exports.OrderSpec = OrderSpec;
