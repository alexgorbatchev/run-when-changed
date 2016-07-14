import { dirname, basename } from 'path';
import find from 'fs-find-root';

export default function formatCmd(cmd, fullFilepath) {
  const filepath = fullFilepath.replace(process.cwd() + '/', '');
  const filedir = dirname(filepath);
  const fullFiledir = dirname(fullFilepath);
  const filename = basename(filepath);
  const values = {
    filedir,
    filename,
    filepath,
    s: filepath,
    'full-filedir': fullFiledir,
    'full-filepath': fullFilepath,
  };

  // chances are we don't always have to look up package.json folder, but
  // performance hit of this is probably so insignificant, it's not worth
  // the time to optimize this... PRs welcome of course :)
  return find
    .file('package.json', fullFiledir)
    .then(rootDir => values['package-json-dir'] = dirname(rootDir))
    .then(() => {
      const keys = Object.keys(values).join('|');
      let results = cmd.replace(new RegExp(`%(${keys})`, 'g'), (match, key) => values[key]);
      return results;
    });
}
