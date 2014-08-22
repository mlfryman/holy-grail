/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Treasure    = require('../../app/models/treasure'),
    Mongo = require('mongodb'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'treasure-map-test',
    obj = {name: ['Knights'], loc:['Doune, Scotland', '56.19', '-4.053'], difficulty:['1'], order:['1'], hints:['hint1', 'hint2', 'hint3'], tags:['tag1, tag2, tag3']};

describe('Treasure', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      console.log(stdout, stderr);
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Treasure object', function(){
      var t = new Treasure(obj);
      expect(t).to.be.instanceof(Treasure);
      expect(t.name).to.equal('Knights');
      expect(t.loc.name).to.equal('Doune, Scotland');
      expect(t.loc.lat).to.be.closeTo(56.19, 0.01);
      expect(t.loc.lng).to.be.closeTo(-4.053, 0.01);
      expect(t.difficulty).to.equal(1);
      expect(t.order).to.equal(1);
      expect(t.tags).to.have.length(3);
      expect(t.photos).to.have.length(0);
      expect(t.hints).to.have.length(3);
      expect(t.isFound).to.equal(false);
      expect(t.isLinkable).to.equal(true);
      // console.log(t);
    });
  });

  describe('.query', function(){
    it('should get all treasures', function(done){
      Treasure.query({}, function(err, treasures){
        expect(treasures).to.have.length(6);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find one treasure object by it\'s ID', function(done){
      Treasure.findById('100000000000000000000001', function(err, t){
        expect(t.name).to.equal('Knights');
        done();
      });
    });
  });

  describe('.found', function(){
    it('should update a treasure\'s isFound property to true', function(done){
      Treasure.found('100000000000000000000001', function(){
        Treasure.findById('100000000000000000000001', function(err, t){ // add err if breaks
          expect(t.isFound).to.be.true;
          done();
        });
      });
    });
  });

  describe('#save', function(){
    it('should save the treasure object in the databse', function(done){
      var t = new Treasure(obj);
      t.save(function(){
        expect(t._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
// Last Bracket
});
