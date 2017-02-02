const constants = require('../constants');

const initialState = {theme_article: []}

function update(state = initialState, action) {
	switch (action.type) {
		case constants.RECEIVE_NEWS:
			return Object.assign({}, state, { news: action.json.news })
		case constants.RECEIVE_ANNOUNCEMENT:
			return Object.assign({}, state, { announcement: action.json.announcement })
		case constants.RECEIVE_THEME:
			return Object.assign({}, state, { theme: action.json.theme })
		case constants.RECEIVE_THEME_ARTICLE:
			return Object.assign({}, state, {
        theme_article: [
          ...state.theme_article,
          action.json.theme_article
        ]
      })
		default:
			return state
  }
}

module.exports = update;
