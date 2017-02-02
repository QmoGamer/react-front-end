import fetch from 'isomorphic-fetch'
const constants = require('../constants')

//取得新聞
function fetchNews(url) {
  return dispatch => {
    return fetch(url + '/api/home/news')
      .then(req => req.json())
      .then(json => dispatch(receiveNews(json)))
  }
}

function receiveNews(json) {
  return {
    type: constants.RECEIVE_NEWS,
    json: json,
    receivedAt: Date.now()
  }
}

//取得公告
function fetchAnnouncement(url) {
  return dispatch => {
    return fetch(url + '/api/home/announcement')
      .then(req => req.json())
      .then(json => dispatch(receiveAnnouncement(json)))
  }
}

function receiveAnnouncement(json) {
  return {
    type: constants.RECEIVE_ANNOUNCEMENT,
    json: json,
    receivedAt: Date.now()
  }
}

//取得主題分類
function fetchTheme(url) {
  return dispatch => {
    return fetch(url + '/api/home/theme')
      .then(req => req.json())
      .then(json => dispatch(receiveTheme(json)))
  }
}

function receiveTheme(json) {
  return {
    type: constants.RECEIVE_THEME,
    json: json,
    receivedAt: Date.now()
  }
}

//取得主題文章
function fetchThemeArticle(url, theme_id, member_cookie='', auth_token='') {
  return dispatch => {
    return fetch(url + '/api/home/theme_article?theme_id=' + theme_id + '&member_cookie=' + encodeURIComponent(member_cookie))
      .then(req => req.json())
      .then(json => dispatch(receiveThemeArticle(json, theme_id)))
  }
}

function receiveThemeArticle(json, theme_id) {
  json.theme_article.theme_id = theme_id

  return {
    type: constants.RECEIVE_THEME_ARTICLE,
    json: json,
    receivedAt: Date.now()
  }
}

// 首頁取得新聞
function apiGetHomeNews( url ) {

  return dispatch => {
    return fetch( url + '/api/home/news', {
      method: 'POST'
    })
      .then( res => res.json() )
  }
}

// 首頁取得公告
function apiGetHomeAnnouncement( url ) {

  return dispatch => {
    return fetch( url + '/api/home/announcement', {
      method: 'POST'
    })
      .then( res => res.json() )
  }
}

module.exports = { 
  fetchNews, 
  fetchAnnouncement, 
  fetchTheme, 
  fetchThemeArticle,
  apiGetHomeNews,
  apiGetHomeAnnouncement
}
