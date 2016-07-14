import { normalize } from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import formatCmd from '../format-cmd';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('format-cmd', () => {
  it('parses %filedir', () => expect(formatCmd('ls %filedir', '/foo/bar/file.txt')).to.eventually.equal('ls /foo/bar'));
  it('parses %filename', () => expect(formatCmd('ls %filename', '/foo/bar/file.txt')).to.eventually.equal('ls file.txt'));
  it('parses %filepath', () => expect(formatCmd('ls %filepath', '/foo/bar/file.txt')).to.eventually.equal('ls /foo/bar/file.txt'));
  it('parses %s', () => expect(formatCmd('ls %s', '/foo/bar/file.txt')).to.eventually.equal('ls /foo/bar/file.txt'));

  it('parses %package-json-dir', () =>
    expect(formatCmd('ls %package-json-dir', `${__dirname}/foo/bar/file.txt`)).to.eventually.equal(`ls ${normalize(__dirname + '/..')}`)
  );
});
