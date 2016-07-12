import { Gaze } from 'gaze';
import { sprintf } from 'sprintf';
import { spawn } from 'child_process';
import ansiBold from 'ansi-bold';
import minimatch from 'minimatch';

function startWatching({ watch, match, exec }, { verbose }) {
  const list = (key, values) => values.map(value => `--${key}=${ansiBold(value)}`).join(', ');
  const log = msg => {
    if (verbose) {
      console.log(msg);
    }
  };

  return new Promise(resolve => {
    match = match || [ '**/*' ];
    const prefix = [ list('watch', watch), list('match', match), list('exec', exec) ].join(' ');
    const gaze = new Gaze(watch);

    gaze.on('ready', watcher => {
      if (Object.keys(watcher.watched()).length) {
        log(`${prefix}: ready!`);
      } else {
        log(`${prefix}: no matches :(`);
        watcher.close();
      }
    });

    gaze.on('changed', filepath => {
      filepath = filepath.replace(process.cwd() + '/', '');

      for (let cmd of exec) {
        cmd = sprintf(cmd, filepath);

        if (match.reduce((last, match) => last && minimatch(filepath, match), true)) {
          log(`${prefix}: ${cmd}`);
          spawn('/bin/sh', [ '-c', cmd ], { stdio: 'inherit' });
        } else {
          log(`${prefix}: skipping ${filepath}`);
        }
      }
    });
  })
}

export default function runWhenChanged(watches, opts) {
  for (const set of watches) {
    startWatching(set, opts);
  }
}
