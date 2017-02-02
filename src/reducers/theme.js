const constants = require('../constants');

const initialState = { select_theme_id: 0, select_sub_theme_id: 0 }

function update(state = initialState, action) {

	switch (action.type) {
		case constants.THEME_ARTICLE:
			return Object.assign({}, state, { theme_article: action.json.theme_article })
		case constants.SELECT_THEME:
			return Object.assign({}, state, { select_theme_id: action.theme_id, select_sub_theme_id: action.sub_theme_id })
		default:
			return state
  }
}

module.exports = update;
