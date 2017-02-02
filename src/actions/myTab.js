const constants = require('../constants')

function changeMyTab(tab) {
  return {
    type: constants.CHANGE_MY_TAB,
    tab: tab
  }
}

module.exports = { changeMyTab }