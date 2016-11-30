"use strict"
const db = require('../models/db');
let Order = require('../models/Order');
//let User = require('../models/user');
let dbCore = require('../models/Core').dbCore;

exports.getOrders = function(req, res) {
  console.log('In get Order');
  console.log(req.user.id + ' ' + req.user.type);
  dbCore.setUser(req.user.id, req.user.type);
  dbCore.getOrders().then((items) => {
                      res.status(200).json(items);
                    })
                    .catch((err) => {
                      res.status(500, {error: err, message: err.message});
                    });
}

exports.getOrderSpec = function(req, res) {
  let id = req.params.id;
  console.log('Get order_spec ID=' + id);
  dbCore.setUser(req.user.id, req.user.type);
  /*dbCore.getOrderSpec(id, function(items) {
    res.status(200).json(items);
  });*/
  dbCore.getOrderSpec(id, function(items, err) {
     if (!err) {
        return res.status(200).json(items);
     } else {
        res.status(500, {error: err, message: err.message});
     }
  })
}
/*
router.get('/orders', isLoggedIn, function(req, res) {
		//Р‘СЂР°С‚СЊ СЃ СЃРµСЃСЃРёРё
		console.log('In get User');
		console.log(req.user.id + ' ' + req.user.type);
		dbCore.setUser(req.user.id, req.user.type);
		dbCore.getOrders().then((items) => {
			                  res.status(200).json(items);
		                  })
										  .catch((err) => {
											  res.status(500, {error: err } );
											});
	});

	router.get('/orders/:id([0-9]+)/order_spec', isLoggedIn, function(req, res) {
		dbCore.setUser(req.user.id, req.user.type);
		let id = req.params.id;
		console.log('Get order_spec ID=' + id);
		dbCore.getOrderSpec(id, function(items) {
			res.status(200).json(items);
		});
	});*/
