"use strict"

let db = require('./db');
let Sequelize = require('sequelize');

let Contractor = db.define('contractor', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
},
{
  freezeTableName: true,
  classMethods: {
    addNew: function(name, parentId) {
      //Если не задан Id родителя
      if (!parentId) {
        return Contractor.create({name: name});
      }else {
        //Если задан Id родителя, ищем родителя, если он найден - добавляем запись и устанавливаем ей родителя
        //если родитель не найден - генерим Exception
        Contractor.findById(parentId).then(function(parentItem) {
          console.log(parentItem);
          if (parentItem !== null) {
            return Contractor.create({name: name}).then(function(item) {
              //
              parentItem.setParent(item);
              });
          } else {
            throw Error('Родитель ID=' + parentId + ' не найден');
          }
        })
      }
    }
  }
}
);
Contractor.hasOne(Contractor, {as: 'Parent', foreignKey: 'parent_id'});

/*Contractor.sync().then(function() {

Contractor.addNew('Bce', null).then(function(contractor) {
  Contractor.addNew('Contr1', 3);
})*/
module.exports = Contractor;
