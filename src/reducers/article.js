const constants = require('../constants');

const initialState = {}

function update(state = initialState, action) {
	// console.log("type: " + action.type);
	// console.log(action.json);
	let result_data = null
	switch (action.type) {
		case constants.POST_ARTICLE:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { post_article: result_data })
		case constants.POST_ARTICLE_CONTENT:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { post_article_content: result_data })
		case constants.UPDATE_ARTICLE:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { update_article: result_data })
		case constants.UPDATE_ARTICLE_CONTENT:
			return Object.assign({}, state, { update_article_content: action.json.update_article_content })
		case constants.ARTICLE_INFO:
			if ( action.json.data.status == 1 ) {
				if ( action.json.data.result.length > 0 ) {
					result_data = action.json.data.result[0]
				}
				else if ( action.json.data.result.length == 0 ) {
					result_data = {}
				}
			}
			else if ( action.json.data.status == 0 ) {
				result_data = action.json.data.error
			}
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { article_info: result_data })
		case constants.CLEAR_ARTICLE_STATUS:
			return Object.assign({}, state, { post_article_content: null })
		case constants.LIKE_ARTICLE_STATUS:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			console.log(result_data);
			return  Object.assign({}, state, { like_article_status: result_data })
		case constants.COLLECT_ARTICLE_STATUS:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			result_data.type = action.json.data.type
			console.log(result_data);
			return  Object.assign({}, state, { collect_article_status: result_data })
		case constants.DELETE_ARTICLE_STATUS:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			console.log(result_data);
			return  Object.assign({}, state, { delete_article_status: result_data })
		case constants.GET_USER_ARTICLE:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			console.log(result_data);
			return  Object.assign({}, state, { user_article_list: result_data })
		default:
			return state
  }
}

module.exports = update;
