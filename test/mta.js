var should = require('should');
var Mta = require('../lib/mta');

var config = {
  key: process.env.MTA_API_KEY,
};

describe('MTA', function () {
  var mta,
    serviceType,
    stopId,
    stopIds,
    feedId;

  before(function (done) {
    mta = new Mta({
      key: config.key
    });
    stopId = "Q03";
    stopIds = ["Q03", "Q04"];
    serviceType = 'subway';
    feedId = 'nqrw';
    done();
  });

  it('should return info for all MTA subway stops', function () {
    return mta.stop()
    .then(function (result) {
      result.should.be.an.Object;
    });
  });

  it('should get info for 1 MTA subway stop', function () {
    return mta.stop(stopId)
    .then(function (result) {
      result.stop_id.should.equal(stopId.toString());
      result.should.have.property('stop_name');
    });
  });

  it('should get info for S30S', function() {
    return mta.stop('S30S')
    .then(function (result) {
      result.stop_id.should.equal('S30S');
      result.should.have.property('stop_name');
    });
  });

  it('should get info for multiple MTA subway stop', function () {
    return mta.stop(stopIds)
    .then(function (result) {
      stopIds.forEach(function (val) {
        result.should.have.property(val);
      });
    });
  });

  it('should get MTA service status for all types', function () {
    return mta.status()
    .then(function (result) {
      result.should.have.property('subway');
      result.should.have.property('bus');
      result.should.have.property('BT');
      result.should.have.property('LIRR');
      result.should.have.property('MetroNorth');
    });
  });

  it('should get MTA service status for 1 type', function () {
    return mta.status(serviceType)
    .then(function (result) {
      result.should.be.an.Array;
    });
  });

  it('MTA_API_KEY should be set', function (done) {
    config.key.should.not.equal('');
    done();
  });

  it('should get schedule info for 1 MTA subway station', function () {
    return mta.schedule(stopId, feedId)
    .then(function (result) {
      result.should.have.property('schedule');
      result.should.have.property('updatedOn');
      result.schedule[stopId].should.exist;
    });
  });


  it('should get schedule info for a station with a different feed_id', function () {
    return mta.schedule('Q03S', 'nqrw')
    .then(function (result) {
      result.should.have.property('schedule');
      result.should.have.property('updatedOn');
      result.schedule['Q03S'].should.exist;
    });
  });

  it('should get schedule info for multiple MTA subway stations', function () {
    return mta.schedule(stopIds, 'nqrw')
    .then(function (result) {
      result.should.have.property('schedule');
      result.should.have.property('updatedOn');
      stopIds.forEach(function (val) {
        result.schedule.should.have.property(val);
      });
    });
  });

});
