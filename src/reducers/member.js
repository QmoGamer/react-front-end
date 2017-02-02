const constants = require('../constants');
// 1 = 註冊, 2 = 登入成功, 3 = 登入失敗
const initialState = { member_status: 0 }

function update(state = initialState, action) {
	
	let result_data = null
	switch (action.type) {
		case constants.MEMBER_REGISTER:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { member_info: result_data, member_status: 1 })
		case constants.MEMBER_SIGN_IN:

			let member_status = 2
			if(  action.json.data.status == 1 ) {
				window.sessionStorage["nickname"] = action.json.data.result.nickname
				window.sessionStorage["photo_path"] = action.json.data.result.photo_path
				window.sessionStorage["token"] = action.json.data.result.token
				window.sessionStorage["id"] = action.json.data.result.id
				window.sessionStorage["cookie"] = action.json.member_cookie
				window.sessionStorage["company_name"] = action.json.data.result.company
				window.sessionStorage["job_title"] = action.json.data.result.job_title
				window.sessionStorage["register_time"] = action.json.data.result.register_time
				window.sessionStorage["email"] = action.json.data.result.email
			}
			else {
				member_status = 3
			}
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { member_info: result_data, member_status: member_status })
		case constants.MEMBER_SIGN_OUT:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { member_info: result_data, member_status: 0 }) 
		case constants.MEMBER_CLEAR_STATUS:
			return Object.assign({}, state, { member_info: null, member_status: 0 })
		case constants.MEMBER_AUTO_LOGIN:
			return Object.assign({}, state, { member_info: action.json, member_status: 2 })
		case constants.GET_MY_COLLECT:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { my_collect: result_data })
		case constants.GET_MY_POST:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { my_post: result_data })
		case constants.GET_MY_FOLLOW:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { my_follow: result_data })
		case constants.FOLLOW_MEMBER_STATUS:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return  Object.assign({}, state, { follow_member_status: result_data })
		case constants.MEMBER_LOGIN_CHECK:
			result_data = action.json.data.result || action.json.data.error
			result_data.api_status = action.json.data.status
			return Object.assign({}, state, { member_info: result_data })
		default:
			return state
  }
}

module.exports = update;
