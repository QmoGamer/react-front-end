var express = require('express');
var router = express.Router();
var request = require("request");
const constants = require('../../constants');

// 取得新聞列表 - 分頁
router.get('/get/news_list', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/news/' + req.query['page']

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  request.post({ url, jar:j }, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取得新聞詳細
router.get('/get/news', function(req, res) {
	let host = constants.API_HOST
  let url = host + '/api/get/news'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['auth_token'],
  	'id': req.query['news_id']
  }

  request.post({url, jar:j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 點讚
router.get('/post/news_like', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/news_like'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['auth_token'],
    'news_id': req.query['news_id']
  }

  request.post({url, jar:j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取消讚
router.get('/delete/news_like', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/delete/news_like'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['auth_token'],
    'news_id': req.query['news_id']
  }

  request.post({url, jar:j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 收藏
router.get('/post/news_collecting', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/news_collecting'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['auth_token'],
    'news_id': req.query['news_id']
  }

  request.post({url, jar:j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取消收藏
router.get('/delete/news_collecting', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/delete/news_collecting'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['auth_token'],
    'news_id': req.query['news_id']
  }

  request.post({url, jar:j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

module.exports = router;