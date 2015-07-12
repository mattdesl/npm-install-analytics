#!/usr/bin/env node
if (!(/^(rm|i|(un)?install)$/.test(process.argv[2]))) {
  // bail early for other commands
  process.exit(0)
}

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    save: 'S',
    'save-dev': 'D'
  },
  boolean: ['save', 'save-dev', 'save-exact', 'save-optional']
})

var command = argv._[0]
var modules = argv._.slice(1)
var save = ''

if (!modules) {
  // bail if we are installing a project
  process.exit(0)
}

var conf = require('rc')('npm-install-analytics')
var ua = require('universal-analytics')

// normalize shorthands
if (command === 'i') {
  command = 'install'
} else if (command === 'rm') {
  command = 'uninstall'
}

if (argv.save) {
  save = 'save'
} else if (argv['save-dev']) {
  save = 'save-dev'
} else if (argv['save-optional']) {
  save = 'save-optional'
} else {
  save = 'default'
}

if (!conf.id) {
  var chalk = require('chalk')
  console.error(chalk.yellow('npm-analytics'), 'could not find tracking ID')
  process.exit(0)
}

var visitor = ua(conf.id)
modules.forEach(function (module) {
  visitor.event(command, save, module)
})
