'use strict';

var mp          = require('multiparty'),
    linkBuilder = require('../helpers/link-builder'),
    Treasure    = require('../models/treasure');

exports.index = function(req, res){
  console.log(req.query);
  Treasure.query(req.query, function(err, treasures){
    console.log('-----------treasures-----------');
    console.log(treasures);
    res.render('treasures/index', {treasures:treasures, linkBuilder:linkBuilder, query:req.query});
  });
};

exports.init = function(req, res){
  Treasure.count(function(err, order){
    order++;
    res.render('treasures/init', {order:order});
  });
};

exports.create = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    Treasure.create(fields, files, function(){
      //console.log('----MULTIPARTY FIELDS START----');
      //console.log(fields);
      //console.log('----MULTIPARTY FIELDS END----');
      res.redirect('/treasures');
    });
  });
};

exports.show = function(req, res){
  Treasure.findById(req.params.id, function(err, treasure){
    console.log('-----------treasure-----------');
    console.log(treasure);
    res.render('treasures/show', {treasure:treasure});
  });
};
/*
exports.found = function(req, res){
  Treasure.found(req.params.id, function(){
    res.redirect('/treasures');
  });
};*/

exports.found = function(req, res){
  Treasure.findById(req.params.id, function(treasure){
    Treasure.found(treasure, function(){
      res.redirect('/treasures');
    });
  });
};
