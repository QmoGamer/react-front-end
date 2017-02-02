import fetch from 'isomorphic-fetch'
const constants = require('../constants')

//api - 發文
function apiPostArticle(url, member_cookie, member_token) {
  return dispatch => {
    return fetch(url + '/api/article/post_article?member_cookie=' + encodeURIComponent(member_cookie) + '&member_token=' + member_token)
      .then(req => req.json())
      .then(json => dispatch(postArticle(json)))
  }
}

function postArticle(json) {
  return {
    type: constants.POST_ARTICLE,
    json: json,
    receivedAt: Date.now()
  }
}

//api - 發文含內容
function apiPostArticleContent(url, member_cookie, member_token, article_id, content) {

  let data = {
    'member_cookie': member_cookie,
    'member_token': member_token,
    'article_id': article_id,
    'content': content,
  }
  // console.log(data)
  return dispatch => {
    return fetch(url+'/api/article/post_article_content', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(req => req.json())
      .then(json => dispatch(postArticleContent(json)))
  }
}

function postArticleContent(json) {
  return {
    type: constants.POST_ARTICLE_CONTENT,
    json: json,
    receivedAt: Date.now()
  }
}

//api - 更新標題&sub主題id
function apiUpdateArticle(url, member_cookie, member_token, article_id, sub_theme_id, title) {
  // console.log('update');
  return dispatch => {
    return fetch(url + '/api/article/update/article?member_cookie=' + encodeURIComponent(member_cookie) + '&member_token=' + member_token + '&article_id=' + article_id + '&sub_theme_id=' + sub_theme_id + '&title=' + title)
      .then(req => req.json())
      .then(json => dispatch(UpdateArticle(json)))
  }
}

function UpdateArticle(json) {
  return {
    type: constants.UPDATE_ARTICLE,
    json: json,
    receivedAt: Date.now()
  }
}

//api - 取得文章
function apiGetArticle( url, article_id, member_cookie, auth_token ) {
  return dispatch => {
    return fetch(url + '/api/article/get/article?article_id=' + article_id + '&member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token)
      .then(req => req.json())
      .then(json => dispatch(GetArticle(json)))
  }
}

function GetArticle( json ) {
  return {
    type: constants.ARTICLE_INFO,
    json: json,
    receivedAt: Date.now()
  }
}

//api - 刪除文章
function apiDeleteArticle( url, article_id, member_cookie, auth_token ) {
  return dispatch => {
    return fetch(url + '/api/article/delete/article?article_id=' + article_id + '&member_cookie=' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token)
      .then(req => req.json())
      .then(json => dispatch(deleteArticle(json)))
  }
}

function deleteArticle( json ) {
  return {
    type: constants.DELETE_ARTICLE_STATUS,
    json: json,
    receivedAt: Date.now()
  }
}

//api - 點讚
function apiLikeArticle( url, member_cookie, auth_token, article_content_id ) {
  return dispatch => {
    return fetch(url + '/api/article/post/like?member_cookie= ' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&article_content_id=' + article_content_id)
      .then(req => req.json())
      .then(json => dispatch(likeArticleStatus(json)))
  }
}

//api - 取消讚
function apiDislikeArticle( url, member_cookie, auth_token, article_content_id ) {
  return dispatch => {
    return fetch(url + '/api/article/delete/like?member_cookie= ' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&article_content_id=' + article_content_id)
      .then(req => req.json())
      .then(json => dispatch(likeArticleStatus(json)))
  }
}

function likeArticleStatus( json ) {
  return {
    type: constants.LIKE_ARTICLE_STATUS,
    json: json,
    receivedAt: Date.now()
  }
}

//api - 收藏
function apiCollectArticle( url, member_cookie, auth_token, article_id ) {
  return dispatch => {
    return fetch(url + '/api/article/post/collecting?member_cookie= ' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&article_id=' + article_id)
      .then(req => req.json())
      .then(json => dispatch(collectionArticleStatus(json, 1)))
  }
}

//api - 取消收藏
function apiDeleteCollectArticle( url, member_cookie, auth_token, article_id ) {
  return dispatch => {
    return fetch(url + '/api/article/delete/collecting?member_cookie= ' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&article_id=' + article_id)
      .then(req => req.json())
      .then(json => dispatch(collectionArticleStatus(json, 2)))
  }
}

function collectionArticleStatus( json, type ) {
  // console.log(json);
  // 1 = 收藏, 2 = 取消收藏
  json.data.type = type

  return {
    type: constants.COLLECT_ARTICLE_STATUS,
    json: json,
    receivedAt: Date.now()
  }
}

//清除狀態
function clearArticleStatus() {
  return {
    type: constants.CLEAR_ARTICLE_STATUS,
    receivedAt: Date.now()
  }
}

// 上傳文章圖片
function apiUploadArticleImg( url, member_cookie, auth_token, article_id, photo, width=constants.UPLOAD_NEW_IMG_WIDTH, height=constants.UPLOAD_NEW_IMG_HEIGHT ) {

  let data = new FormData()
  data.append('member_cookie', member_cookie)
  data.append('auth_token', auth_token)
  data.append('article_id', article_id)
  data.append('photo', photo)
  data.append('width', width)
  data.append('height', height)
  
  return dispatch => {
    return fetch( url + '/api/article/post/article_photo', {
      method: 'POST',
      body: data
    })
      .then( res => res.json() )
  }
}

//ver2 - 點讚
function ver2_apiLikeArticle( url, member_cookie, auth_token, article_content_id ) {
  return dispatch => {
    return fetch(url + '/api/article/post/like?member_cookie= ' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&article_content_id=' + article_content_id)
      .then(req => req.json())
  }
}

//ver2 - 取消讚
function ver2_apiDislikeArticle( url, member_cookie, auth_token, article_content_id ) {
  return dispatch => {
    return fetch(url + '/api/article/delete/like?member_cookie= ' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&article_content_id=' + article_content_id)
      .then(req => req.json())
  }
}

//ver2 - 收藏
function ver2_apiCollectArticle( url, member_cookie, auth_token, article_id ) {
  return dispatch => {
    return fetch(url + '/api/article/post/collecting?member_cookie= ' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&article_id=' + article_id)
      .then(req => req.json())
  }
}

//ver2 - 取消收藏
function ver2_apiDeleteCollectArticle( url, member_cookie, auth_token, article_id ) {
  return dispatch => {
    return fetch(url + '/api/article/delete/collecting?member_cookie= ' + encodeURIComponent(member_cookie) + '&auth_token=' + auth_token + '&article_id=' + article_id)
      .then(req => req.json())
  }
}

// api - 搜尋關鍵字
function searchArrticle( url, member_cookie, auth_token, keyword, page, page_count=8 ) {
  
  let data = {
    member_cookie: member_cookie,
    auth_token: auth_token,
    keyword: keyword,
    page: page,
    page_count: page_count
  }
  
  return dispatch => {
    return fetch( url + '/api/article/search', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// api - 取得文章內容
function apiGetArticleContent( url, member_cookie, auth_token, article_content_id ) {

  let data = {
    member_cookie: member_cookie,
    auth_token: auth_token,
    article_content_id: article_content_id
  }
  
  return dispatch => {
    return fetch( url + '/api/article/get/article_content', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

// api - 更新文章內容
function apiUpdateArticleContent( url, member_cookie, auth_token, article_content_id, content ) {

  let data = {
    member_cookie: member_cookie,
    auth_token: auth_token,
    article_content_id: article_content_id,
    content: content
  }
  
  return dispatch => {
    return fetch( url + '/api/article/update/article_content', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then( res => res.json() )
  }
}

module.exports = { 
  apiPostArticle, 
  apiPostArticleContent, 
  apiUpdateArticle, 
  apiGetArticle, 
  apiLikeArticle,
  apiDeleteArticle,
  apiDislikeArticle,
  apiCollectArticle,
  apiDeleteCollectArticle,
  clearArticleStatus,
  apiUploadArticleImg,
  ver2_apiLikeArticle,
  ver2_apiDislikeArticle,
  ver2_apiCollectArticle,
  ver2_apiDeleteCollectArticle,
  searchArrticle,
  apiGetArticleContent,
  apiUpdateArticleContent
}
