'use strict';

var Mongo = require('mongodb'),
    _        = require('lodash'),
    fs = require('fs'),
    path = require('path');

function Treasure(o){
  this.name = o.name[0];
  this.loc = {};
  this.loc.name = o.loc[0];
  this.loc.lat = parseFloat(o.loc[1]);
  this.loc.lng = parseFloat(o.loc[2]);
  this.difficulty = parseInt(o.difficulty[0]);
  this.order = parseInt(o.order[0]);
  this.photos = [];
  this.hints = o.hints;
  this.tags = o.tags[0].split(',').map(function(t){return t.trim();});
  this._isFound = false;
}

Object.defineProperty(Treasure, 'collection', {
  get: function(){return global.mongodb.collection('treasures');}
});

Treasure.query = function(query, sort, cb){
  Treasure.collection.find(query, sort).toArray(cb);
};

Treasure.create = function(fields, files, cb){
  var t = new Treasure(fields);
  t.save(function(){
    t.addPhotos(files, cb);
  });
};

Treasure.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Treasure.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(Treasure.prototype, obj));
  });
};


Treasure.prototype.save = function(cb){
  Treasure.collection.save(this, cb);
};

Treasure.found = function(id, cb){
  id = Mongo.ObjectID(id);
  Treasure.collection.update({_id:id}, {$set:{isFound:true}}, cb);
};

Treasure.prototype.addPhoto = function(files, cb){
  var dir = __dirname + '/../static/img/' + this._id,
      exist = fs.existsSync(dir),
      self = this;

  if(!exist){
    fs.mkdirSync(dir);
  }

  files.photos.forEach(function(photo){
    var ext = path.extname(photo.path),
    rel = '/img/' + self._id + '/' + self.photos.length + ext,
    abs = dir + '/' + self.photos.length + ext;
    fs.renameSync(photo.path, abs);

    self.photos.push(rel);
  });

  Treasure.collection.save(self, cb);
};

module.exports = Treasure;

