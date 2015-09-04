// Test Mocha : ordre naturel de collection
// ========================================

'use strict';

/* global describe, it, before, beforeEach */

var chai = require('chai');

describe('The collection', function() {
  var coll;

  before(function() {
    chai.should();
  });

  beforeEach(function() {
    var Collection = require('models/collection');
    coll = new Collection();
  });

  it('should maintain the natural order', function() {
    var oldCheckIn = { key: Date.now() - 1000000 };
    var recentCheckIn = { key: Date.now() - 1000 };
    coll.add(oldCheckIn);
    coll.add(recentCheckIn);

    coll.at(0).toJSON().should.deep.equal(recentCheckIn, 'First check-in should be the most recent');
    coll.at(1).toJSON().should.deep.equal(oldCheckIn, 'Last check-in should be the least recent');
  });
});
