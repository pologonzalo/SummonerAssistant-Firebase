const _ = require('lodash')

module.exports = {
  stringToInt
}

function stringToInt(string) {
  return _.isNaN(parseInt(string)) ? 0 : parseInt(string)
}