#!/usr/bin/env node
if (!(/^(i|install)$/.test(process.argv[2]))) {
  // bail early for other commands
  process.exit(0)
}

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    save: 'S',
    'save-dev': 'D',
    global: 'g'
  },
  boolean: ['save', 'global', 'save-dev', 'save-exact', 'save-optional']
})

var modules = argv._.slice(1)
var save = ''

if (modules.length === 0) {
  // bail if we are installing a project
  process.exit(0)
}

var conf = require('rc')('npm-install-analytics')
var ua = require('universal-analytics')
var chalk = require('chalk')
var user = conf.user
var id = conf.id

if (!user) {
  console.error(chalk.red('npm-analytics'), 'no user set\nRun the following:')
  console.error('  npm-install-analytics-setup')
  process.exit(1)
}

if (!id) {
  console.error(chalk.yellow('npm-analytics'), 'could not find tracking ID')
  process.exit(0)
}

if (argv.save) {
  save = 'save'
} else if (argv['save-dev']) {
  save = 'save-dev'
} else if (argv['save-optional']) {
  save = 'save-optional'
} else if (argv.global) {
  save = 'global'
} else {
  save = ''
}

var visitor = ua(id)
modules.forEach(function (module) {  
  visitor.event(user, module, save, 0, function (err) {
    if (err) {
      console.error(chalk.red('npm-analytics'), err.message)
    }
  })
})
