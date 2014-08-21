'use strict';

var Treasure = require('../models/treasure'),
    mp = require('multiparty');

exports.index = function(req, res){
  Treasure.query(req.query, function(err, treasures){
    res.render('treasures/index', {treasures:treasures});
  });
};

exports.init = function(req, res){
  res.render('treasures/init');
};

exports.create = function(req,res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    Treasure.create(fields, files, function(){
      res.redirect('/treasures/');
    });
  });
};

exports.show = function(req, res){
  Treasure.findById(req.params.id, function(err, treasure){
    res.render('treasures/show', {treasure:treasure});
  });
};
