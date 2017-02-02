import fetch from 'isomorphic-fetch'
const constants = require('../constants')

// 取得新聞列表 - 分頁
function apiGetNewsList(url, page, member_cookie, auth_token) {
  return dispatch => {
    return fetch(url + '/api/news/get/news_list?page=' + page + '&member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token)
      .then(req => req.json())
      .then(json => dispatch(getNewsLIST(json)))
  }
}

function getNewsLIST(json) {
  return {
    type: constants.GET_NEWS_LIST_PAGE,
    json: json,
    receivedAt: Date.now()
  }
}

// 取得新聞
function apiGetNews( url, news_id, member_cookie, auth_token ) {
  return dispatch => {
    return fetch(url + '/api/news/get/news?news_id=' + news_id + '&member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token)
      .then(req => req.json())
      .then(json => dispatch(getNews(json)))
  }
}

function getNews(json) {
  return {
    type: constants.GET_NEWS_DETAIL,
    json: json,
    receivedAt: Date.now()
  }
}

// 新聞點讚
function apiLikeNews( url, member_cookie, auth_token, news_id ) {
  return dispatch => {
    return fetch(url + '/api/news/post/news_like?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&news_id=' + news_id)
      .then(req => req.json())
      .then(json => dispatch(likeNewsStatus(json)))
  }
}

// 新聞取消讚
function apiDislikeNews( url, member_cookie, auth_token, news_id ) {
  return dispatch => {
    return fetch(url + '/api/news/delete/news_like?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&news_id=' + news_id)
      .then(req => req.json())
      .then(json => dispatch(likeNewsStatus(json)))
  }
}

function likeNewsStatus(json) {
  return {
    type: constants.LIKE_NEWS_STATUS,
    json: json,
    receivedAt: Date.now()
  }
}

// 收藏新聞
function apiCollectNews( url, member_cookie, auth_token, news_id ) {
  return dispatch => {
    return fetch(url + '/api/news/post/news_collecting?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&news_id=' + news_id)
      .then(req => req.json())
      .then(json => dispatch(collecNewsStatus(json)))
  }
}

// 取消收藏新聞
function apiDeleteCollectNews( url, member_cookie, auth_token, news_id ) {
  return dispatch => {
    return fetch(url + '/api/news/delete/news_collecting?member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&news_id=' + news_id)
      .then(req => req.json())
      .then(json => dispatch(collecNewsStatus(json)))
  }
}

function collecNewsStatus(json) {
  return {
    type: constants.COLLECT_NEWS_STATUS,
    json: json,
    receivedAt: Date.now()
  }
}

module.exports = { apiGetNewsList, apiGetNews, apiLikeNews, apiDislikeNews, apiCollectNews, apiDeleteCollectNews }
