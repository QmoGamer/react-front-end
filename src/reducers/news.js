const constants = require('../constants');
const initialState = {}

function update(state = initialState, action) {
	// console.log("type: " + action.type);
	// console.log(action.json);
	let result_data = null
	switch (action.type) {
		case constants.GET_NEWS_LIST_PAGE:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { news_list: result_data })
		case constants.GET_NEWS_DETAIL:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { news_detail: result_data })
		case constants.LIKE_NEWS_STATUS:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			console.log(result_data);
			return Object.assign({}, state, { like_news_status: result_data })
		case constants.COLLECT_NEWS_STATUS:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			console.log(result_data);
			return Object.assign({}, state, { collect_news_status: result_data })
		default:
			return state
  }
}

module.exports = update;
