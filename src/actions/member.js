import fetch from 'isomorphic-fetch'
const constants = require('../constants')

//api - 註冊會員
function apiMemberRegister(url, name, email, password, company_name, job_title) {
  
  let data = {
    name: name,
    email: email,
    password: btoa(password),
    company_name: company_name,
    job_title: job_title
  }
  
  return dispatch => {
    return fetch( url + '/api/member/memberRegister', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
  // return dispatch => {
  //   return fetch(url + '/api/member/memberRegister?nickname=' + nickname + '&email=' + email + '&password=' + password + '&company_name=' + company_name + '&job_title=' + job_title )
  //     .then(req => req.json())
  //     .then(json => dispatch(memberRegister(json)))
  // }
}

function memberRegister(json) {
  return {
    type: constants.MEMBER_REGISTER,
    json: json,
    receivedAt: Date.now()
  }
}

//api - 登入會員
function apiMemberSignIn(url, email, password) {

  let data = {
    email: email,
    password: btoa(password),
  }

  return dispatch => {
    return fetch( url + '/api/member/memberSignIn', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
      .then( json => dispatch( memberInfo( json ) ) )
  }
  // return dispatch => {
  //   return fetch(url + '/api/member/memberSignIn?email=' + email + '&password=' + password )
  //     .then(req => req.json())
  //     .then(json => dispatch(memberInfo(json)))
  // }
}

function memberInfo(json) {
  // console.log(json);
  return {
    type: constants.MEMBER_SIGN_IN,
    json: json,
    receivedAt: Date.now()
  }
}

//api - 會員登出
function apiMemberSignOut( url, member_cookie, auth_token ) {
  // console.log(member_cookie);
  return dispatch => {
    return fetch(url + '/api/member/sign/out?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token )
      .then(req => req.json())
      .then(json => dispatch(memberSignOut(json)))
  }
}

function memberSignOut(json) {
  // console.log(json);
  return {
    type: constants.MEMBER_SIGN_OUT,
    json: json,
    receivedAt: Date.now()
  }
}

// 追蹤
function apiFollowMember( url, member_cookie, auth_token, user_id) {
  return dispatch => {
    return fetch(url + '/api/member/follow_member?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&user_id=' + user_id )
      .then(req => req.json())
      .then(json => dispatch(followMemberStatus(json)))
  }
}

// 取消追蹤
function apiUnfollowMember( url, member_cookie, auth_token, user_id ) {
  return dispatch => {
    return fetch(url + '/api/member/unfollow_member?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&user_id=' + user_id )
      .then(req => req.json())
      .then(json => dispatch(followMemberStatus(json)))
  }
}

function followMemberStatus( json ) {
  return {
    type: constants.FOLLOW_MEMBER_STATUS,
    json: json,
    receivedAt: Date.now()
  }
}

// api - 取得會員資訊
function apiMemberInfo( url, user_id ) {
  // return 
}

// 狀態歸0
function clearMemberStatus() {
  return {
    type: constants.MEMBER_CLEAR_STATUS,
    receivedAt: Date.now()
  }
}

// sessionStorage存在自動登入
function autoLogin(json) {
  return {
    type: constants.MEMBER_AUTO_LOGIN,
    json: json,
    receivedAt: Date.now()
  }
}

// 取得我的收藏
function apiGetMyCollect( url, member_cookie, auth_token, page ) {
  return dispatch => {
    return fetch(url + '/api/member/get/collect?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&page=' + page )
      .then(req => req.json())
      .then(json => dispatch(getMyCollect(json)))
  }
}

function getMyCollect( json ) {
  return {
    type: constants.GET_MY_COLLECT,
    json: json,
    receivedAt: Date.now()
  }
}

// 取得我的發文
function apiGetMyPost( url, member_cookie, auth_token, user_id, page, page_count=8 ) {
  return dispatch => {
    return fetch(url + '/api/member/get/post?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&user_id=' + user_id + '&page=' + page + '&page_count=' + page_count)
      .then(req => req.json())
      .then(json => dispatch(getMyPost(json)))
  }
}

function getMyPost( json ) {
  return {
    type: constants.GET_MY_POST,
    json: json,
    receivedAt: Date.now()
  }
}

// 取得我的追蹤
function apiGetMyFollow( url, member_cookie, auth_token, page ) {
  return dispatch => {
    return fetch(url + '/api/member/get/follow?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&page=' + page )
      .then(req => req.json())
      .then(json => dispatch(getMyFolow(json)))
  }
}

function getMyFolow( json ) {
  return {
    type: constants.GET_MY_FOLLOW,
    json: json,
    receivedAt: Date.now()
  }
}

// api - login check
function apiMemberLoginCheck( url, member_cookie, auth_token ) {
  // console.log(member_cookie)
  return dispatch => {
    return fetch(url + '/api/member/login_check?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token )
      .then(req => req.json())
      .then(json => dispatch(memberLoginCheck(json)))
  }
}

function memberLoginCheck( json ) {
  // console.log(json);
  return {
    type: constants.MEMBER_LOGIN_CHECK,
    json: json,
    receivedAt: Date.now()
  }
}

// 取得會員文章
function apiGetUserArticle( url, member_cookie, auth_token, user_id, page, page_count=constants.ARTICLE_LIST_PAGE_COUNT ) {

  // let data = new FormData()
  // data.append('member_cookie', member_cookie)
  // data.append('auth_token', auth_token)
  // data.append('user_id', user_id)
  // data.append('page', page)
  // data.append('page_count', page_count)

  let data = {
    member_cookie: member_cookie,
    auth_token: auth_token,
    user_id: user_id,
    page: page,
    page_count: page_count
  }
  
  return dispatch => {
    return fetch( url + '/api/member/get/user/article', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// 取得會員資訊
function apiGetUserInfo( url, member_cookie, auth_token, user_id ) {
  
  // let data = new FormData()
  // data.append('member_cookie', member_cookie)
  // data.append('auth_token', auth_token)
  // data.append('user_id', user_id)
  let data = {
    member_cookie: member_cookie,
    auth_token: auth_token,
    user_id: user_id
  }
  
  return dispatch => {
    return fetch( url + '/api/member/get/user/info', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// 忘記密碼
function apiForgotPassword ( url, email ) {

  let data = {
    email: email
  }

  return dispatch => {
    return fetch( url + '/api/member/forgot/password', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// 重置密碼
function apiResetPassword ( url, email, token, new_password, confirm_password ) {

  let data = {
    email: email,
    token: token,
    new_password: new_password,
    confirm_password: confirm_password
  }

  return dispatch => {
    return fetch( url + '/api/member/reset/password', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// 驗證信箱
function apiAuthenticateEmail( url, email, token ) {

  let data = {
    email: email,
    token: token
  }

  return dispatch => {
    return fetch( url + '/api/member/authenticate', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// 修改會員資料
function apiUpdateMemberInfo ( url, member_cookie, auth_token, type, value ) {

  let data = {
    member_cookie: member_cookie,
    auth_token: auth_token,
    type: type,
    value: value
  }
  // console.log( data )
  return dispatch => {
    return fetch( url + '/api/member/update/info', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// 修改會員大頭貼 
function apiUpdateMemberPropic ( url, member_cookie, auth_token, photo, width=constants.UPLOAD_MEMBER_IMG_WIDTH, height=constants.UPLOAD_MEMBER_IMG_HEIGHT  ) {

  let data = new FormData()
  data.append('member_cookie', member_cookie)
  data.append('auth_token', auth_token)
  data.append('photo', photo)
  data.append('width', width)
  data.append('height', height)
  
  return dispatch => {
    return fetch( url + '/api/member/update/pic_pro', {
      method: 'POST',
      body: data
    })
      .then( res => res.json() )
  }
}

// 修改密碼
function apiUpdateMemberPassword ( url, member_cookie, auth_token, password, new_password, confirm_password ) {

  let data = {
    member_cookie: member_cookie,
    auth_token: auth_token,
    password: password,
    new_password: new_password,
    confirm_password: confirm_password
  }

  return dispatch => {
    return fetch( url + '/api/member/update/password', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// ver2 取得我的追蹤
function ver2_apiGetMyFollow ( url, member_cookie, auth_token, page, page_count=8 ) {

  let data = {
    member_cookie: member_cookie,
    auth_token: auth_token,
    page: page,
    page_count: page_count
  }
  
  return dispatch => {
    return fetch( url + '/api/member/get/follow', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

module.exports = { 
  apiMemberRegister, 
  apiMemberSignIn, 
  clearMemberStatus, 
  autoLogin, 
  apiGetMyCollect, 
  apiGetMyPost, 
  apiGetMyFollow, 
  apiFollowMember, 
  apiUnfollowMember,
  apiMemberSignOut,
  apiMemberLoginCheck,
  apiGetUserArticle,
  apiGetUserInfo,
  apiForgotPassword,
  apiResetPassword,
  apiAuthenticateEmail,
  apiUpdateMemberInfo,
  apiUpdateMemberPropic,
  apiUpdateMemberPassword,
  ver2_apiGetMyFollow
}

// 加密
// function encrypt( string ) {

//   let new_string = ''

//   for (var i = 0; i < string.length; i++) {
//     new_string += String.fromCharCode( ( string.charCodeAt(i) * 2 ) )
//   }

//   return new_string
// }
