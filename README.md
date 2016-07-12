# run-when-changed

[![GratiPay](https://img.shields.io/gratipay/user/alexgorbatchev.svg)](https://gratipay.com/alexgorbatchev/)
![Downloads](https://img.shields.io/npm/dm/run-when-changed.svg)
![Version](https://img.shields.io/npm/v/run-when-changed.svg)

Selectively executes commands when watched files are changed.

## Installation

```
npm instal --save-dev run-when-changed
```

## Usage

```
Usage: run-when-changed --watch <glob> --match [glob] --exec <cmd> (--watch <glob> --match [glob] --exec <cmd>)

Selectively executes commands when watched files are changed.

Options:

  -h, --help          output usage information
  -w, --watch <glob>  A glob to watch, starts a new group
  -e, --exec <cmd>    Command to execute, eg "echo %s"
  -m, --match [glob]  Only files that match will be executed
  --verbose           Verbose mode
```

## Examples

### Watching one or more glob

```
$ run-when-changed --watch "**/*.js" --exec "ls -la %s"
$ run-when-changed --watch "**/*.js" --watch "README.md" --exec "ls -la %s"
```

### Executing multiple commands

```
$ run-when-changed --watch "**/*.js" --exec "ls -la %s" --exec "chmod +x %s"
```

### Watching multiple globs 

```
$ run-when-changed \
  --watch "**/*.js" --exec "ls -la %s" \  # executes `ls` for `*.js` files
  --watch "**/*.txt" --exec "rm %s" \     # executes `rm` for `*.txt` files
```

### Filtering

```
# executes `ls` for `*-test.js` files
$ run-when-changed --watch "**/*.js" --filter "*-test.js" --exec "ls -la %s"
```

### Running mocha

This command will execute `mocha` test runner for all `tests/**/*-test.js` files.

```
run-when-changed \
  --watch "tests/**/*-test.js" \
  --exec "mocha --require babel-register %s" \
  --verbose
```

## Notes

1. `filter` and `exec` applies only to immediately preceeding `watch`
1. You can have as many `filter` and `exec` after one or many `watch`

## License

ISC
