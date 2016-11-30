"use strict"
const db = require('../models/db');
let GGroup = require('../models/ggroup');
let dbCore = require('../models/Core').dbCore;

exports.getGGroup = function (req, res) {

  dbCore.getGGroup((result, error) => {
    if (error) {
      res.status(500, {error: error, message: error.message});
    } else {
      res.status(200).json(result);
    }
  });

}

exports.getGoods = function(req, res) {
  let ggroup = req.params.id;
  let limit = req.body.limit;
  let offset = req.body.offset;
  dbCore.getGoods(ggroup, limit, offset).then((items) => {
    res.status(200).json(items);
  }).catch((error) => {
    res.status(500, {error: error, message: error.message})
  });
}

exports.getGoodsCnt = function(req, res) {
  let ggroup = req.params.id;

  dbCore.getGoodsCnt(ggroup, (result, error) => {
    if (error) {
      res.status(500, {error: error, message: error.message});
    } else {
      res.status(200).json(result);
    }
  });
}
