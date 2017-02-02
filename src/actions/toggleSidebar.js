const constants = require('../constants')

function toggleSidebar(bool) {
  return {
    type: constants.TOGGLE_SIDEBAR,
    toggle: bool
  }
}

function closeSidebar() {
	return {
		type: constants.TOGGLE_SIDEBAR,
		toggle: false
	}
}

module.exports = { toggleSidebar, closeSidebar }