import { dirname, basename, sep } from 'path';
import find from 'fs-find-root';

function packageJsonIsRequired(cmd) {
  return new RegExp('%package-json-dir').test(cmd);
}

function findPackageJsonDir(isRequired, fullFiledir) {
  if (!isRequired) {
    return Promise.resolve('');
  }

  return find
    .file('package.json', fullFiledir)
    .then(rootDir => {
      if (rootDir === null) {
        throw new Error('package.json path has been used in the command but it could not be found in the folder tree.')
      }

      return rootDir
    });
}

export default function formatCmd(cmd, fullFilepath) {
  const filepath = fullFilepath.replace(process.cwd() + sep, '');
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

  return findPackageJsonDir(packageJsonIsRequired(cmd), fullFiledir)
    .then(rootDir => values['package-json-dir'] = dirname(rootDir))
    .then(() => {
      const keys = Object.keys(values).join('|');
      let results = cmd.replace(new RegExp(`%(${keys})`, 'g'), (match, key) => values[key]);
      return results;
    });
}
