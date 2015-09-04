/* global describe, it, before, beforeEach, afterEach, sinon */

describe("The home view", function() {
  before(function envSetup() {
    // Env setup
    var Backbone = require('backbone');
    Backbone.$ = require('jquery');
    require('backbone-mediator');
    require('moment').lang('fr');
  });

  var xhr, clock, prompt, connect;
  var homeView;

  beforeEach(function testSetup() {
    // Mocks & Isolation
    xhr = sinon.fakeServer.create();
    clock = sinon.useFakeTimers(1412507461204);
    prompt = sinon.stub(window, 'prompt').returns('Christophe');
    connect = sinon.stub(require('socket.io'), 'connect').returns({ on: function() {} });

    // Test subjects
    var HomeView = require('views/home_view');
    homeView = new HomeView().render();
  });

  afterEach(function testTearDown() {
    // Mocks & Isolation teardown
    xhr.restore();
    clock.restore();
    prompt.restore();
    connect.restore();
  });

  it("should properly render the clock at startup", function() {
    homeView.$('#ticker').text().should.equal('dimanche 5 octobre 2014 13:11:01');
  });

  it("should update the clock every second", function() {
    clock.tick(1001);
    homeView.$('#ticker').text().should.equal('dimanche 5 octobre 2014 13:11:02');
    clock.tick(1000);
    homeView.$('#ticker').text().should.equal('dimanche 5 octobre 2014 13:11:03');
  });
});
