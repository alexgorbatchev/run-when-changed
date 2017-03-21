import { Gaze } from 'gaze';
import { spawn } from 'child_process';
import { sep } from 'path';
import ansiBold from 'ansi-bold';
import minimatch from 'minimatch';
import formatCmd from './format-cmd';

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
      const relativeFilepath = filepath.replace(process.cwd() + sep, '');

      exec.forEach(cmd => {
        if (!match.reduce((last, match) => last && minimatch(relativeFilepath, match, { dot: true }), true)) {
          return log(`${prefix}: skipping ${relativeFilepath}`);
        }

        formatCmd(cmd, filepath).then(cmd => {
          log(`${prefix}: ${cmd}`);
          spawn(cmd, [], { shell: true, stdio: 'inherit' });
        });
      });
    });
  })
}

export default function runWhenChanged(watches, opts) {
  watches.forEach(set => startWatching(set, opts));
}
