import fetch from 'isomorphic-fetch'
const constants = require('../constants')

// 最新主題文章
function apiNewThemeArticle( url, member_cookie, auth_token, theme_id, page, page_count = constants.ARTICLE_LIST_PAGE_COUNT, timestamp = new Date().getTime(), stamp = 'before' ) {

  let data = {
    'member_cookie': member_cookie,
    'auth_token': auth_token,
    'theme_id': theme_id,
    'page': page,
    'page_count': page_count,
    'timestamp': timestamp,
    'stamp': stamp
  }

  return dispatch => {
    return fetch( url + '/api/theme/theme_article/new', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// 熱門主題文章
function apiHotThemeArticle( url, member_cookie, auth_token, theme_id, page, page_count = constants.ARTICLE_LIST_PAGE_COUNT ) {

  let data = {
    'member_cookie': member_cookie,
    'auth_token': auth_token,
    'theme_id': theme_id,
    'page': page,
    'page_count': page_count
  }

  return dispatch => {
    return fetch( url + '/api/theme/theme_article/hot', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

function themeArticle(json) {
  return {
    type: constants.THEME_ARTICLE,
    json: json,
    receivedAt: Date.now()
  }
}

// 最新sub主題文章
function apiNewSubThemeArticle( url, member_cookie, auth_token, sub_theme_id, page, page_count = constants.ARTICLE_LIST_PAGE_COUNT, timestamp = new Date().getTime(), stamp = 'before' ) {

  let data = {
    'member_cookie': member_cookie,
    'auth_token': auth_token,
    'sub_theme_id': sub_theme_id,
    'page': page,
    'page_count': page_count,
    'timestamp': timestamp,
    'stamp': stamp
  }

  return dispatch => {
    return fetch( url + '/api/theme/sub_theme_article/new', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
  // return dispatch => {
  //   return fetch(url + '/api/theme/sub_theme_article/new?sub_theme_id=' + sub_theme_id + '&member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token)
  //     .then(req => req.json())
  //     .then(json => dispatch(subThemeArticle(json)))
  // }
}

// 熱門sub主題文章
function apiHotSubThemeArticle( url, member_cookie, auth_token, sub_theme_id, page, page_count = constants.ARTICLE_LIST_PAGE_COUNT ) {

  let data = {
    'member_cookie': member_cookie,
    'auth_token': auth_token,
    'sub_theme_id': sub_theme_id,
    'page': page,
    'page_count': page_count
  }
  // console.log(data)
  return dispatch => {
    return fetch( url + '/api/theme/sub_theme_article/hot', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
  // return dispatch => {
  //   return fetch(url + '/api/theme/sub_theme_article/hot?sub_theme_id=' + sub_theme_id + '&member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token)
  //     .then(req => req.json())
  //     .then(json => dispatch(subThemeArticle(json)))
  // }
}

function subThemeArticle(json) {
  return {
    type: constants.THEME_ARTICLE,
    json: json,
    receivedAt: Date.now()
  }
}

// 記錄主題id, 副主題id
function selectTheme( theme_id, sub_theme_id ) {
  // console.log(theme_id, sub_theme_id)
  return {
    type: constants.SELECT_THEME,
    theme_id: theme_id,
    sub_theme_id: sub_theme_id,
    receivedAt: Date.now()
  }
}

// 最新首頁主題文章 
function apiNewHomeThemeArticle( url, member_cookie, auth_token, page_count = constants.ARTICLE_LIST_PAGE_COUNT, timestamp = new Date().getTime(), stamp = 'before' ) {

  let data = {
    'member_cookie': member_cookie,
    'auth_token': auth_token,
    'page_count': page_count,
    'timestamp': timestamp,
    'stamp': stamp
  }

  return dispatch => {
    return fetch( url + '/api/theme/home_theme_article/new', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// 熱門首頁主題文章
function apiHotHomeThemeArticle( url, member_cookie, auth_token, page_count = constants.ARTICLE_LIST_PAGE_COUNT ) {
  
  let data = {
    'member_cookie': member_cookie,
    'auth_token': auth_token,
    'page_count': page_count
  }

  return dispatch => {
    return fetch( url + '/api/theme/home_theme_article/hot', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

module.exports = { 
  apiNewThemeArticle, 
  apiHotThemeArticle, 
  apiNewSubThemeArticle, 
  apiHotSubThemeArticle, 
  selectTheme,
  apiNewHomeThemeArticle,
  apiHotHomeThemeArticle
}
