/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Treasure    = require('../../app/models/treasure'),
    Mongo = require('mongodb'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'treasure-map-test',
    t1;

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
      var t = new Treasure({name: 'fancy wool', loc:{name:'Reykjavíc, Iceland', lat:'64.133333', lng:'-21.933333'}, difficulty:'1', order:'1', hints:{1:'hint1', 2:'hint2', 3:'hint3'}, tags:'tag1, tag2, tag3'});
      expect(t).to.be.instanceof(Treasure);
      expect(t.name).to.equal('fancy wool');
      expect(t.loc.name).to.equal('Reykjavíc, Iceland');
      expect(t.loc.lat).to.be.closeTo(64.133333, 0.01);
      expect(t.loc.lng).to.be.closeTo(-21.933333, 0.01);
      expect(t.difficulty).to.equal(1);
      expect(t.order).to.equal(1);
      expect(t.tags).to.have.length(3);
      expect(t.tags[1]).to.equal('tag2');
      expect(t.photos).to.have.length(0);
      expect(t.hints).to.have.length(3);
      expect(t.hints[0]).to.equal('hint1');
      expect(t._isFound).to.equal(false);
    });
  });

  describe('.query', function(){
    it('should get all treasure', function(done){
      Treasure.query({}, {}, function(err, treasures){
        expect(treasures).to.have.length(3);
        done();
      });
    });
  });

  describe('.create', function(){
    it('should create a treasure', function(done){
      var t = {name: 'fancy wool', loc:{name:'Reykjavíc, Iceland', lat:'64.133333', lng:'-21.933333'}, difficulty:'1', order:'1', photos:['wool1.jpg, wool2.jpg'], hints:{1:'hint1', 2:'hint2', 3:'hint3'}, tags:'tag1, tag2, tag3'};
      Treasure.create(t, function(err, treasure){
        expect(treasure._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a treasure by its id', function(done){
      Treasure.findById(Mongo.ObjectID('100000000000000000000001'), function(err, treasure){
        expect(treasure.name).to.equal('fancy wool');
        expect(treasure).to.be.instanceof(Treasure);
        done();
      });
    });
  });

  describe('#save', function(){
    it('should insert a new treasure into the database', function(done){
      t1 = new Treasure({name: 'fancy wool', loc:{name:'Reykjavíc, Iceland', lat:'64.133333', lng:'-21.933333'}, difficulty:'1', order:'1', hints:{1:'hint1', 2:'hint2', 3:'hint3'}, tags:'tag1, tag2, tag3'});
      t1.save(function(){
        expect(t1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });

    it('should update an exiting treasure from the database', function(done){
      t1.name = 'kittens';
      t1.save(function(){
        Treasure.findById(t1._id, function(err, treasure){
          expect(t1.name).to.equal('kittens');
          done();
        });
      });
    });
  });

  describe('.found', function(){
    it('should save _isFound as true in the database', function(done){
      var id = '100000000000000000000001';
      Treasure.found(id, function(){
        Treasure.findById(id, function(err, treasure){
          expect(treasure._isFound).to.be.true;
          done();
        });
      });
    });
  });
  //Last Bracket
});
