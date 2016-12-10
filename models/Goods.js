"use strict"

let db = require('./db');
let Sequelize = require('sequelize');
let GGroup = require('./GGroup');

let GoodsAll = db.define('goods_all', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imgURL: {type: Sequelize.STRING},
  shortDescription: {type: Sequelize.STRING}
},
{
  freezeTableName: true
}
);
GGroup.hasMany(GoodsAll);
GoodsAll.belongsTo(GGroup);

let Promo = db.define('promo', {
  caption: {type: Sequelize.STRING, allowNull: false},
  text: {type: Sequelize.STRING, allowNull: false},
  type: {type: Sequelize.INTEGER, allowNull: false}
},
  {
    freezeTableName: true
  }
);

let PromoPeriod = db.define('promo_period', {
  startDate: {type: Sequelize.DATEONLY, allowNull: false},
  endDate: {type: Sequelize.DATEONLY, allowNull: false},
  priority: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 1},
  percent: {type: Sequelize.DOUBLE}
},
{
  freezeTableName: true
});
Promo.hasMany(PromoPeriod);
PromoPeriod.belongsTo(Promo);

let PromoObjects = db.define('promo_objects', {
  objType: {type: Sequelize.STRING, allowNull: false},
  r_object: {type: Sequelize.INTEGER, allowNull: false}
},
{
  freezeTableName: true
});
PromoPeriod.hasMany(PromoObjects);
PromoObjects.belongsTo(PromoPeriod);

let PriceList = db.define('price_list', {
  price: {type: Sequelize.DOUBLE, allowNull: false},
  oldPrice: {type: Sequelize.DOUBLE}
},
{
  freezeTableName: true
});
GoodsAll.hasOne(PriceList);

module.exports.GoodsAll = GoodsAll;
module.exports.Promo = Promo;
module.exports.PromoPeriod = PromoPeriod;
module.exports.PromoObjects = PromoObjects;
module.exports.PriceList = PriceList;
