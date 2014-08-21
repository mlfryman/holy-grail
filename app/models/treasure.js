'use strict';

var Mongo = require('mongodb'),
    fs    = require('fs'),
    path  = require('path');

function Treasure(o){
  this.name = o.name[0];
  this.difficulty = o.difficulty[0] * 1;
  this.order = o.order[0] * 1;
  // 0: name, 1: lat, 2: lng
  this.loc = {};
  this.loc.name = o.loc[0];
  this.loc.lat = parseFloat(o.loc[1]);
  this.loc.lng = parseFloat(o.loc[2]);
  this.tags = o.tags[0].split(',').map(function(s){return s.trim();});
  this.photos = [];
  this.hints = o.hints;
  this.isFound = false;
  this.isLinkable = this.order === 1 ? true : false;
}

Object.defineProperty(Treasure, 'collection', {
  get: function(){return global.mongodb.collection('treasures');}
});

Treasure.query = function(query, cb){
  // console.log('model.query.query', query);
  var filter = {},
      sort   = {};
  if(query.tag){filter = {tags:{$in:[query.tag]}};}
  if(query.sort){sort[query.sort] = query.order * 1;}
  // console.log('model.filter', filter);
  // console.log('model.sort', sort);
  Treasure.collection.find(filter).sort(sort).toArray(cb);
};

Treasure.count = function(cb){
  Treasure.collection.count(cb);
};

Treasure.findById = function(id, cb){
  id = Mongo.ObjectID(id);
  Treasure.collection.findOne({_id:id}, cb);
};

Treasure.found = function(id, cb){
  id = Mongo.ObjectID(id);
  Treasure.collection.findOne({_id:id}, function(err, t){
    Treasure.collection.update({_id:id}, {$set:{isFound:true}}, function(){
      var next = t.order + 1;
      Treasure.collection.update({order:next}, {$set:{isLinkable:true}}, cb);
    });
  });
};

Treasure.create = function(fields, files, cb){
  var t = new Treasure(fields);
  t.save(function(){
    t.addPhotos(files, cb);
  });
};

Treasure.prototype.save = function(cb){
  Treasure.collection.save(this, cb);
};

Treasure.prototype.addPhotos = function(files, cb){
  var dir    = __dirname + '/../static/img/' + this._id,
      staticRoot   = '/img/' + this._id + '/',
      exists = fs.existsSync(dir),
      self   = this;

  if(!exists){
    fs.mkdirSync(dir);
  }
  files.photos.forEach(function(photo){
    var ext = path.extname(photo.path),
        fileName = self.photos.length + ext,
        rel = staticRoot + fileName,
        abs = dir + '/' + fileName;
    fs.renameSync(photo.path, abs);
    self.photos.push(rel);
  });
  self.save(cb);
};

module.exports = Treasure;
