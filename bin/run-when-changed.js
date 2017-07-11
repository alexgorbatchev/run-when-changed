#!/usr/bin/env node
'use strict';

var commander = require('commander');
var runWhenChanged = require('../lib').default;
var watches = [];

function add(key, value) {
  var node = watches[watches.length - 1];

  if (node && key === 'watch') {
    var keys = Object.keys(node).join(' ');
    if (keys !== 'watch') {
      node = null;
    }
  }

  if (!node) {
    node = {};
    watches.push(node);
  }

  if (!node[key]) {
    node[key] = [];
  }

  node[key].push(value);
}

commander.usage('--watch <glob> --match [glob] --exec <cmd> (--watch <glob> --match [glob] --exec <cmd>)').description('Selectively executes commands when watched files are changed.').option('-w, --watch <glob>', 'A glob to watch, starts a new group', function (val) {
  return add('watch', val);
}).option('-e, --exec <cmd>', 'Command to execute, eg "echo %s"', function (val) {
  return add('exec', val);
}).option('-m, --match [glob]', 'Only files that match will be executed', function (val) {
  return add('match', val);
}).option('-i, --interval [milliseconds]', 'Interval to pass to fs.watchFile in milliseconds').option('-d, --debounce [milliseconds]', 'Delay for events called in succession for the same file/event in milliseconds').option('-m, --mode [auto|watch|poll]', "Force the watch mode. Either 'auto' (default), 'watch' (force native events), or 'poll' (force stat polling)").option('-c, --cwd [directory]', 'The current working directory to base file patterns from. Default is process.cwd()').option('--verbose', 'Verbose mode').parse(process.argv);

runWhenChanged(watches, {
  verbose: commander.verbose,
  gazeOptions: {
    interval: commander.interval,
    debounce: commander.debounce,
    mode: commander.mode,
    cwd: commander.cwd
  }
});
//# sourceMappingURL=run-when-changed.js.map