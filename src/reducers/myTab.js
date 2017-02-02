const constants = require('../constants');
// 1=追蹤 2=收藏 3=我的
const initialState = { tab: 3 }

function update(state = initialState, action) {
	switch (action.type) {
		case constants.CHANGE_MY_TAB:
			return Object.assign({}, state, { tab: action.tab })
		default:
			return state
  }
}

module.exports = update;
