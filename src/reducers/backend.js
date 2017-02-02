const constants = require('../constants');
const initialState = { theme_action_status: 0, action_status: 0 }

function update(state = initialState, action) {
	// console.log(action);
	let result_data = null;

	switch (action.type) {
		case constants.GET_THEME_LIST:
			return Object.assign({}, state, { theme: action.json.theme })
		case constants.THEME_ACTION_STATUS:
			return Object.assign({}, state, { theme_action_status: action.json.status })
		case constants.GET_NEWS_LIST:
			return Object.assign({}, state, { news: action.json.news })
		case constants.GET_NEWS:
			return Object.assign({}, state, { news_detail: action.json.news_detail })
		case constants.ACTION_STATUS:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { action_status: result_data })
		case constants.NEWS_UPLOAD_IMG:
			// console.log(action.json);
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { news_upload_img: result_data })
		default:
			return state
  }
}

module.exports = update;
