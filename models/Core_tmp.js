"use strict"

let Sequelize = require('sequelize');
let db = require('./db');
let User = require('./User');
let Contractor = require('./Contractor');
let OrderPr = require('./Order');
let async = require('async');

class DBCore  {
  //let userOrders = {};
  syncDB(force) {
    db.sync({force: force});
  }

  //задаем scope в зависимости от роли пользователя для заказов - userOrders
/* getUser(id) {
   User.findById(id).then(function(user) {
     if (!user || (user === null)) {
       throw Error('User ID=' + id + ' не найден');
     } else {
         return user;
     }
  });
}*/

  setUser(id, userType) {
    OrderPr.setUser(id, userType);
    /*if (User.isClient(userType)) {
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
    }*/
  }

  getOrders() {
    return OrderPr.findAll();
  }
}

    /*
    User.findById(id).then(function(user) {
      if (!user || (user === null)) {
        throw Error('User ID=' + id + ' не найден');
      } else if (user.isClient()) {
         OrderPr.addScope('defaultScope', {
           where: {
            $and: [['order_pr.contractorId IN (SELECT contractorId from usercontractor WHERE userId = ?)', id],
                   ['order_pr.businessId IN (SELECT businessId from userbusiness WHERE userId = ?)', id]]
           }
         }, {override: true});
      } else if(user.isManager()) {
        OrderPr.addScope('defaultScope', {
          where: {
           $and: [['order_pr.managerId IN (SELECT contractorId from usercontractor WHERE userId = ?)', id],
                  ['order_pr.businessId IN (SELECT businessId from userbusiness WHERE userId = ?)', id]]
          }
        }, {override: true});
      } else if(user.isAdmin()) {
        console.log('admin');
        OrderPr.addScope('defaultScope', {}, {override: true});
      } else {
        throw Error('Тип пользователя #' + user.type + ' не описан');
      }
      //OrderPr.scope('userOrders').findAll

      OrderPr.findAll().then(function(items) {
        items.forEach(function(item) {
          console.log(item.id);
        });
      });

    });
  }

  /*getUserOrders() {
    console.log('getUserOrders');
    userOrders.findAll().then(function(items) {console.log('aa');});
    //this.setUser(3).then(function() {});
    //OrderPr.scope('userOrders').findAll().then(function(items) {console.log('aa');});
  }*/
//}
    //User.findById(id).then(function(user) {
      //if (user.isClient || user.isManager) {
        //user.getBusinesses().then(function(userBusinesses) {

          //let listID = [];
          //userBusinesses.forEach(function(item) {
            //listID.push(item.id);
          //});

          //let obj = JSON.parse('{"where": { "businessId": [' + listID.join(',') + '] }}');

          //OrderPr.addScope('userOrders', obj);//{where: { businessId: [...] }});

          /*let userOrders = OrderPr.scope('userOrders');

          userOrders.findAll().then(function(items) {
            items.forEach(function(item) {
              console.log(item.id);
            });
          });*/
        //});
      //}
    //});
//  }
//}

let dbCore = new DBCore();
dbCore.setUser(3, 0);
dbCore.getOrders().then(function(items) {
  items.forEach(function(item) {
    console.log(item.id);
  });
  console.log('next user');
  dbCore.setUser(1, 4);
  dbCore.getOrders().then(function(items) {
    items.forEach(function(item) {
      console.log(item.id);
    });
  });
});
//dbCore.uOrders(3).findAll(function(items) {console.log('aaa')});
//dbCore.userOrders(3).then(function(a) {console.log('AAAA')});
//findAll().then(function(items) {console.log(items[0].id)});

//then(function(userOrders) {userOrders.findAll().then(function(items) {console.log(items[0].id)})});
//dbCore.getUserOrders();
//.then(function() {});
//dbCore.syncDB(true);

//dbCore.getUserOrders();
//dbCore.getUserOrders().then(function(items) {items.forEach(function(item) {console.log(item.id)})});
