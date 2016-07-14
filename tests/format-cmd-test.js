import { normalize } from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import formatCmd from '../format-cmd';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('format-cmd', () => {
  const fullFilepath = `${__dirname}/foo/bar/file.txt`;

  it('parses %filedir', () =>
    expect(formatCmd('ls %filedir', fullFilepath)).to.eventually.equal('ls tests/foo/bar')
  );

  it('parses %full-filedir', () =>
    expect(formatCmd('ls %full-filedir', fullFilepath)).to.eventually.equal(`ls ${__dirname}/foo/bar`)
  );

  it('parses %filename', () =>
    expect(formatCmd('ls %filename', fullFilepath)).to.eventually.equal('ls file.txt')
  );

  it('parses %filepath', () =>
    expect(formatCmd('ls %filepath', fullFilepath)).to.eventually.equal(`ls tests/foo/bar/file.txt`)
  );

  it('parses %full-filepath', () =>
    expect(formatCmd('ls %full-filepath', fullFilepath)).to.eventually.equal(`ls ${__dirname}/foo/bar/file.txt`)
  );

  it('parses %s', () =>
    expect(formatCmd('ls %s', fullFilepath)).to.eventually.equal(`ls tests/foo/bar/file.txt`)
  );

  it('parses %package-json-dir', () =>
    expect(formatCmd('ls %package-json-dir', fullFilepath)).to.eventually.equal(`ls ${normalize(__dirname + '/..')}`)
  );
});
