#!/usr/bin/env node
var read = require('read')
var chalk = require('chalk')

var win = process.platform === 'win32'
var home = win
  ? process.env.USERPROFILE
  : process.env.HOME

var path = require('path')
var fs = require('fs')

var name = 'npm-install-analytics'
var file = path.resolve(home, '.' + name + 'rc')

read({ prompt: 'What is your username?' }, function (err, user) {
  user = validate(err, user, 'Must provide a username!')
  read({ prompt: 'What is your UA Tracking ID?' }, function (err, id) {
    id = validate(err, id, 'Must provide a UA Tracking ID!')
    var json = JSON.stringify({
      id: id, user: user
    }, undefined, 2)
    fs.writeFile(file, json, function (err) {
      if (err) {
        console.error(chalk.red("Error writing rc file:"), err.message)
        process.exit(1)
      }
      console.log(chalk.bold("Config saved to:"), chalk.gray(file))
    })
  })
})

function validate(err, text, msg) {
  if (err) {
    console.error(chalk.red(err.message))
    process.exit(1)
  }
  text = text.trim()
  if (!text) {
    console.error(chalk.red(msg))
    process.exit(1)
  }
  return text
}