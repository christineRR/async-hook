'use strict';

const expect = require('chai').expect;
const asyncHook = require('../');

describe('async hook', function() {

  let initUid = NaN;
  let initCall = 0;
  let initHandleName = '';
  let initParent = {};
  let destroyUid = NaN;
  let destroyCall = 0;
  let setTimeoutCalled = false;
  let timerId = null;

  before(function(done) {
    function asyncInit(uid, handle, parent) {
      initUid = uid;
      initCall += 1;
      initHandleName = handle.constructor.name;
      initParent = parent;
    }

    function asyncBefore(uid) {
      console.log('asyncBefore setTimeout called!');
    }

    function asyncAfter(uid) {
      console.log('asyncAfter setTimeout called!');
    }

    function asyncDestroy(uid) {
      destroyUid = uid;
      destroyCall += 1;
    }

    asyncHook.addHooks({
      init: asyncInit,
      pre: asyncBefore,
      post: asyncAfter,
      destroy: asyncDestroy
    });

    asyncHook.enable();
    done();
  });

  after(function(done) {
    clearTimeout(timerId);
    asyncHook.disable();  
    
    expect(initUid).to.equal(destroyUid);
    expect(setTimeoutCalled).to.be.true;
    expect(initHandleName).to.equal('TimeoutWrap');
    expect(initCall).to.equal(1);
    expect(destroyCall).to.equal(1);
    done();
  });

  it('setTimeout', function(done) {
    timerId = window.setTimeout(function() {
      setTimeoutCalled = true;
      done();
    }, 10);
  });
});