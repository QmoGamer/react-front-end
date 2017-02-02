import fetch from 'isomorphic-fetch'
const constants = require('../constants')

// 取得主題列表
function apiGetThemeList(url) {
  return dispatch => {
    return fetch(url + '/api/backend/get/mainboard')
      .then(req => req.json())
      .then(json => dispatch(getThemeList(json)))
  }
}

function getThemeList(json) {
  return {
    type: constants.GET_THEME_LIST,
    json: json,
    receivedAt: Date.now()
  }
}

// 新增主題
function apiAddTheme(url, cookie, name) {
  return dispatch => {
    return fetch(url + '/api/backend/post/mainboard?cookie=' + cookie + '&name=' + name)
      .then(req => req.json())
      .then(json => dispatch(themeActionStatus(json)))
  }
}

// 新增副主題
function apiAddSubTheme(url, cookie, theme_id, name) {
  return dispatch => {
    return fetch(url + '/api/backend/post/subboard?cookie=' + cookie + '&theme_id=' + theme_id + '&name=' + name)
      .then(req => req.json())
      .then(json => dispatch(themeActionStatus(json)))
  }
}

// 更新主題
function apiUpdateTheme(url, cookie, theme_id, name) {
  return dispatch => {
    return fetch(url + '/api/backend/update/mainboard?cookie=' + cookie + '&theme_id=' + theme_id + '&name=' + name)
      .then(req => req.json())
      .then(json => dispatch(themeActionStatus(json)))
  }
}

// 更新副主題
function apiUpdateSubTheme(url, cookie, sub_theme_id, name) {
  return dispatch => {
    return fetch(url + '/api/backend/update/subboard?cookie=' + cookie + '&sub_theme_id=' + sub_theme_id + '&name=' + name)
      .then(req => req.json())
      .then(json => dispatch(themeActionStatus(json)))
  }
}

// 刪除主題
function apiDeleteTheme(url, cookie, theme_id) {
  return dispatch => {
    return fetch(url + '/api/backend/delete/mainboard?cookie=' + cookie + '&theme_id=' + theme_id)
      .then(req => req.json())
      .then(json => dispatch(themeActionStatus(json)))
  }
}

// 刪除副主題
function apiDeleteSubTheme(url, cookie, sub_theme_id) {
  return dispatch => {
    return fetch(url + '/api/backend/delete/subboard?cookie=' + cookie + '&sub_theme_id=' + sub_theme_id)
      .then(req => req.json())
      .then(json => dispatch(themeActionStatus(json)))
  }
}

function themeActionStatus(json) {
  return {
    type: constants.THEME_ACTION_STATUS,
    json: json,
    receivedAt: Date.now()
  }
}

// 取得新聞列表
function apiGetNewsList(url) {
  return dispatch => {
    return fetch(url + '/api/backend/get/news')
      .then(req => req.json())
      .then(json => dispatch(getNewsList(json)))
  }
}

function getNewsList(json) {
  return {
    type: constants.GET_NEWS_LIST,
    json: json,
    receivedAt: Date.now()
  }
}

// 取得新聞
function apiGetNews(url, news_id) {
  return dispatch => {
    return fetch(url + '/api/backend/get/news_detail?news_id=' + news_id)
      .then(req => req.json())
      .then(json => dispatch(getNews(json)))
  }
}

function getNews(json) {
  // console.log(json)
  return {
    type: constants.GET_NEWS,
    json: json,
    receivedAt: Date.now()
  }
}

// 新增新聞
function apiAddNews( url, member_cookie, auth_token ) {

  let data = {
    member_cookie: member_cookie,
    auth_token: auth_token
  }

  return dispatch => {
    return fetch( url+'/api/backend/post/news', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
      .then( req => req.json() )
  }
}
// function apiAddNews(url, member_cookie, title, type_id, start_time, end_time, content, is_sticky, is_delete, is_disable) {

//   let data = {
//     'member_cookie': decodeURIComponent(member_cookie),
//     'title': title,
//     'type_id': type_id,
//     'start_time': start_time,
//     'end_time': end_time,
//     'content': content,
//     'is_sticky': is_sticky,
//     'is_delete': is_delete,
//     'is_disable': is_disable
//   }

//   return dispatch => {
//     return fetch(url+'/api/backend/post/news', {
//       method: 'POST',
//       body: JSON.stringify(data),
//       headers: {
//         "Content-Type": "application/json"
//       }
//     })
//       .then(req => req.json())
//       .then(json => dispatch(actionStatus(json)))
//   }
// }

// 更新新聞
function apiUpdateNews(url, member_cookie, auth_token, news_id, title, type_id, start_time, end_time, content, is_sticky, is_delete, is_draft) {

  let data = {
    'member_cookie': member_cookie,
    'auth_token': auth_token,
    'news_id': news_id,
    'title': title,
    'type_id': type_id,
    'start_time': start_time,
    'end_time': end_time,
    'content': content,
    'is_sticky': is_sticky,
    'is_delete': is_delete,
    'is_draft': is_draft
  }

  return dispatch => {
    return fetch(url+'/api/backend/update/news', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(req => req.json())
      .then(json => dispatch(actionStatus(json)))
  }
}

// 刪除新聞
function apiDeleteNews(url, member_cookie, auth_token, news_id) {

  let data = {
    'member_cookie': member_cookie,
    'auth_token': auth_token,
    'news_id': news_id
  }

  return dispatch => {
    fetch( url + '/api/backend/delete/news', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then( res => res.json() )
      .then( json => dispatch( actionStatus( json ) ) )
  }
}

function actionStatus(json) {
  // console.log(json)
  return {
    type: constants.ACTION_STATUS,
    json: json,
    receivedAt: Date.now()
  }
}

// 上傳新聞圖片
function apiUploadNewsImg( url, member_cookie, auth_token, news_id, photo, width=constants.UPLOAD_NEW_IMG_WIDTH, height=constants.UPLOAD_NEW_IMG_HEIGHT ) {

  let data = new FormData()
  data.append('member_cookie', member_cookie)
  data.append('auth_token', auth_token)
  data.append('news_id', news_id)
  data.append('photo', photo)
  data.append('width', width)
  data.append('height', height)
  
  return dispatch => {
    return fetch(url+'/api/backend/post/news_photo', {
      method: 'POST',
      body: data
    })
      .then( res => res.json() )

  }
}

// ver2 取得主題列表 
function ver2_apiGetTheme( url ) {

  return dispatch => {
    return fetch( url + '/api/backend/get/theme', {
      method: 'POST'
    })
      .then( res => res.json() )
  }
}

// 取得文章詳細
function apiGetArticle( url, article_id ) {

  let data = {
    'article_id': article_id
  }

  return dispatch => {
    return fetch( url + '/api/backend/get/article', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then( res => res.json() )
  }
}

// 取得後台文章列表
function apiGetArticleList( url, theme_id = 0, sub_theme_id = 0 ) {

  let data = {}

  if( sub_theme_id != 0 ) {
    data.sub_theme_id = sub_theme_id
  }
  else if( theme_id != 0 ) {
    data.theme_id = theme_id
  }
  // console.log(data)
  return dispatch => {
    return fetch( url + '/api/backend/get/articles', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then( res => res.json() )
  }
}

// 移動文章 
function apiMoveArticle( url, article_id, subboard_id ) {

  let data = {
    article_id: article_id,
    subboard_id: subboard_id
  }
  // console.log(data)
  return dispatch => {
    return fetch( url + '/api/backend/move/article', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then( res => res.json() )
  } 
}

// 刪除文章
function apiRemoveArticle( url, article_id, reason ) {

  let data = {
    article_id: article_id,
    reason: reason
  }
  // console.log(data)
  return dispatch => {
    return fetch( url + '/api/backend/remove/article', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then( res => res.json() )
  } 
}

// 刪除回文
function apiRemoveArticleContent( url, article_content_id, reason ) {

  let data = {
    article_content_id: article_content_id,
    reason: reason
  }
  // console.log(data)
  return dispatch => {
    return fetch( url + '/api/backend/remove/article_content', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then( res => res.json() )
  } 
}

module.exports = { 
  apiGetThemeList, 
  apiAddTheme, 
  apiAddSubTheme, 
  apiUpdateTheme, 
  apiUpdateSubTheme, 
  apiDeleteTheme, 
  apiDeleteSubTheme,
  apiGetNewsList,
  apiGetNews,
  apiAddNews,
  apiUpdateNews,
  apiDeleteNews,
  apiUploadNewsImg,
  ver2_apiGetTheme,
  apiGetArticle,
  apiGetArticleList,
  apiMoveArticle,
  apiRemoveArticle,
  apiRemoveArticleContent
}
