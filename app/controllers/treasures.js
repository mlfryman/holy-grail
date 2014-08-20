'use strict';

var Treasure = require('../models/treasure'),
    mp = require('multiparty');

exports.index = function(req, res){
  res.render('treasures/index');
};

exports.init = function(req, res){
  res.render('treasures/init');
};

exports.create = function(req, res){
  var treasure = new Treasure(req.body);
  treasure.insert(function(){
    res.redirect('/treasures');
  });
};

/*exports.show = function(req, res){
  Treasure.findById(req.params.id, function(err, treasure){
    res.render('treasures/show', {treasure:treasure});
  });
}; 

exports.addPhoto = function(req, res){
  Treasure.findById(req.params.id, function(err, treasure){

    var form = new mp.Form();
    form.parse(req, function(err, fields, files){
      treasure.addPhoto(files, function(){
        res.redirect('/treasures/' + req.params.id);
      });
    });
  });
}; */
