'use strict';

const AsyncHook = require('./async-hook.js');

// If a another copy (same version or not) of stack-chain exists it will result
// in wrong stack traces (most likely dublicate callSites).
if (global._asyncHook) {
  // In case the version match, we can simply return the first initialized copy
  if (global._asyncHook.version === require('./package.json').version) {
    module.exports = global._asyncHook;
  }
  // The version don't match, this is really bad. Lets just throw
  else {
    throw new Error('Conflicting version of async-hook found');
  }
} else {
  module.exports = global._asyncHook = new AsyncHook();
}
