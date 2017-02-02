const constants = require('../constants');

const initialState = {}

function update(state = initialState, action) {
	switch (action.type) {
		case constants.TOGGLE_SIDEBAR:
			return Object.assign({}, state, { "toggle": action.toggle })
		default:
			return state
  }
}

module.exports = update;
