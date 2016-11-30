"use strict"
const db = require('../models/db');
let News = require('../models/news');
let dbCore = require('../models/Core').dbCore;

exports.getNewsCount = function(req, res) {
  dbCore.getNewsCnt().then((item) => {
                          res.status(200).json(item.dataValues.cnt);
                        })
                        .catch((err) => {
                           res.status(500, {error: err, message: err.message});
                         });
}

exports.getNews = function (req, res) {
  /*let lastId =  req.body.lastId;
  let perPage = req.body.perPage;
  let page = req.params.page;
  let limit = perPage;
  if (!lastId && page && (page > 1) {
     limit = perPage * page;
  }*/
  let limit = req.body.limit;
  let offset = req.body.offset;

  dbCore.getNewsByOffset(limit, offset)
        .then((items) => {
           res.status(200).json(items)
         })
        .catch((err) => {
           res.status(500, {error: err, message: err.message});
         });
}

exports.getNewsById = function(req, res) {
  let id = req.params.id;
  dbCore.getNewsById(id, (result, error) => {
    if (error) {
      res.status(500, {error: error, message: error.message});
    } else {
      res.status(200).json(result);
    }
  })
}
