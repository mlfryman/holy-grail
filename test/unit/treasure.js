/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Treasure    = require('../../app/models/treasure'),
    Mongo = require('mongodb'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'treasure-map-test',
    oid       = '100000000000000000000001',
    obj = {name: ['fancy wool'], loc:['Reykjavíc, Iceland', '64.133333', '-21.933333'], difficulty:['1'], order:['1'], hints:['hint1', 'hint2', 'hint3'], tags:['tag1, tag2, tag3']};

describe('Treasure', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Treasure object', function(){
      var t = new Treasure(obj);
      expect(t).to.be.instanceof(Treasure);
      expect(t.name).to.equal('fancy wool');
      expect(t.loc.name).to.equal('Reykjavíc, Iceland');
      expect(t.loc.lat).to.be.closeTo(64.133333, 0.01);
      expect(t.loc.lng).to.be.closeTo(-21.933333, 0.01);
      expect(t.difficulty).to.equal(1);
      expect(t.order).to.equal(1);
      expect(t.tags).to.have.length(3);
      expect(t.photos).to.have.length(0);
      expect(t.hints).to.have.length(3);
      expect(t.isFound).to.equal(false);
    });
  });

  describe('.query', function(){
    it('should get all treasures', function(done){
      Treasure.query({}, function(err, treasures){
        expect(treasures).to.have.length(3);
        done();
      });
    });
  });

  describe('.count', function(){
    it('should return the number of treasure objects in the database', function(done){
      Treasure.count(function(err, num){
        expect(num).to.equal(3);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a treasure object by it\'s ID', function(done){
      Treasure.findById(oid, function(err, t){
        expect(t._id.toString()).to.equal(oid);
        done();
      });
    });
  });

  describe('.found', function(){
    it('should update a treasures isFound property to true', function(done){
      Treasure.found(oid, function(){
        Treasure.findById(oid, function(err, t){
          expect(t.isFound).to.equal(true);
          done();
        });
      });
    });
  });

  describe('#save', function(){
    it('should save the object in the databse', function(done){
      var t = new Treasure(obj);
      t.save(function(){
        expect(t._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
// Last Bracket
});
