'use strict';

var Mongo = require('mongodb'),
    _        = require('lodash');
// cp = require('child_process'),
// fs = require('fs'),
// path = require('path');

function Treasure(o){
  this.name = o.name;
  this.loc = {name:o.loc.name, lat:parseFloat(o.loc.lat), lng:parseFloat(o.loc.lng)};
  this.difficulty = parseInt(o.difficulty);
  this.order = parseInt(o.order);
  this.photos = [];
  this.hints = makeArray(o.hints);
  this.tags = o.tags.split(',').map(function(t){return t.trim();});
  this._isFound = false;
}

Object.defineProperty(Treasure, 'collection', {
  get: function(){return global.mongodb.collection('treasures');}
});

Treasure.query = function(query, sort, cb){
  Treasure.collection.find(query, sort).toArray(cb);
};

Treasure.create = function(o, cb){
  var t = new Treasure(o);
  Treasure.collection.save(t, cb);
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

/* Treasure.prototype.addPhoto = function(files, cb){
  var dir = __dirname + '/../static/img/' + this._id,
      exist = fs.existsSync(dir),
      self = this;

  if(!exist){
    fs.mkdirSync(dir);
  }

  files.photos.forEach(function(photo){
    var ext = path.extname(photo.path),
    rel = '/img/' + self._id + '/' + self.photos.length + ext, // relative path
    abs = dir + '/' + self.photos.length + ext; // absolute path
    fs.renameSync(photo.path, abs);

    self.photos.push(rel);
  });

  Treasure.collection.save(self, cb);
}; */

module.exports = Treasure;

// PRIVATE HELPER FUNCTIONS //

function makeArray(o){
  var keys  = Object.keys(o),
      hints = [];
  keys.forEach(function(key){
    hints.push(o[key]);
  });
  return hints;
}
