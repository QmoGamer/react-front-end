var express = require('express');
var router = express.Router();
var request = require("request");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var fs = require('fs')

var api_manager = require('./api_manager');
const constants = require('../../constants');

// 取得主題列表
router.get('/get/mainboard', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/mainboard'

  request.post({url, form: { 'filter': "1" }}, function (error, response, body) {
    if( response.statusCode == 200 || response.statusCode == 400 ) {
      res.json({ theme: JSON.parse(body) })
    }
    else {
      res.json({ theme: {"status":"0", "error": {"error_code": "00001"}} })
    }
  });
});

// 取得主題列表
router.post('/get/theme', function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/get/mainboard'
  
  //cookie
  let member_cookie = ''

  //form
  let form = {
    filter: '1'
  }

  api_manager.postForm(url, member_cookie, form, res);
});

// 新增主題
router.get('/post/mainboard', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/mainboard'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['cookie']);
  j.setCookie(cookie, url);

  request.post({url, jar: j, form: { 'name': req.query['name'] }}, function (error, response, body) {
    if( response.statusCode == 200 || response.statusCode == 400 ) {
      res.json({ status: JSON.parse(body) })
    }
    else {
      res.json({ status: {"status":"0", "error": {"error_code": "00001"}} })
    }
  });
})

// 新增副主題
router.get('/post/subboard', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/subboard'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['cookie']);
  j.setCookie(cookie, url);

  request.post({url, jar: j, form: { 'mainboard_id': req.query['theme_id'], 'name': req.query['name'] }}, function (error, response, body) {
    if( response.statusCode == 200 || response.statusCode == 400 ) {
      res.json({ status: JSON.parse(body) })
    }
    else {
      res.json({ status: {"status":"0", "error": {"error_code": "00001"}} })
    }
  });
})

// 更新主題
router.get('/update/mainboard', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/update/mainboard'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['cookie']);
  j.setCookie(cookie, url);

  request.post({url, jar: j, form: { 'id': req.query['theme_id'], 'name': req.query['name'] }}, function (error, response, body) {
    if( response.statusCode == 200 || response.statusCode == 400 ) {
      res.json({ status: JSON.parse(body) })
    }
    else {
      res.json({ status: {"status":"0", "error": {"error_code": "00001"}} })
    }
  });
})

// 更新副主題
router.get('/update/subboard', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/update/subboard'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['cookie']);
  j.setCookie(cookie, url);

  request.post({url, jar: j, form: { 'id': req.query['sub_theme_id'], 'name': req.query['name'] }}, function (error, response, body) {
    if( response.statusCode == 200 || response.statusCode == 400 ) {
      res.json({ status: JSON.parse(body) })
    }
    else {
      res.json({ status: {"status":"0", "error": {"error_code": "00001"}} })
    }
  });
})

// 刪除主題
router.get('/delete/mainboard', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/delete/mainboard'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['cookie']);
  j.setCookie(cookie, url);

  request.post({url, jar: j, form: { 'id': req.query['theme_id'] }}, function (error, response, body) {
    if( response.statusCode == 200 || response.statusCode == 400 ) {
      res.json({ status: JSON.parse(body) })
    }
    else {
      res.json({ status: {"status":"0", "error": {"error_code": "00001"}} })
    }
  });
})

// 刪除副主題
router.get('/delete/subboard', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/delete/subboard'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['cookie']);
  j.setCookie(cookie, url);

  request.post({url, jar: j, form: { 'id': req.query['sub_theme_id'] }}, function (error, response, body) {
    if( response.statusCode == 200 || response.statusCode == 400 ) {
      res.json({ status: JSON.parse(body) })
    }
    else {
      res.json({ status: {"status":"0", "error": {"error_code": "00001"}} })
    }
  });
})

// 取得新聞列表
router.get('/get/news', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/news'

  request.post({url, form: { 'filter': "all" }}, function (error, response, body) {
    if( response.statusCode == 200 || response.statusCode == 400 ) {
      res.json({ news: JSON.parse(body) })
    }
    else {
      res.json({ news: {"status":"0", "error": {"error_code": "00001"}} })
    }
  });
});

// 取得新聞
router.get('/get/news_detail', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/news'

  request.post({url, form: { 'id': req.query['news_id'] }}, function (error, response, body) {
    if( response.statusCode == 200 || response.statusCode == 400 ) {
      res.json({ news_detail: JSON.parse(body) })
    }
    else {
      res.json({ news_detail: {"status":"0", "error": {"error_code": "00001"}} })
    }
  });
})

// 新增新聞
router.post('/post/news', jsonParser, function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/news'
  
  //cookie
  let member_cookie = req.body.member_cookie

  //form
  let form = {
    auth_token: req.body.auth_token
  }

  api_manager.postForm(url, member_cookie, form, res);
})

// 更新新聞
router.post('/update/news', jsonParser, function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/update/news'

  //cookie
  let member_cookie = req.body.member_cookie

  //form
  let form = {
    id: req.body.news_id,
    auth_token: req.body.auth_token,
    title: req.body.title,
    type_id: req.body.type_id,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    content: req.body.content,
    issticky: req.body.is_sticky,
    isdelete: req.body.is_delete,
    isdraft: req.body.is_draft
  }

  api_manager.postForm(url, member_cookie, form, res);
})

// 刪除新聞
router.post('/delete/news', jsonParser, function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/delete/news'

  //cookie
  let member_cookie = req.body.member_cookie

  //form
  let form = {
    auth_token: req.body.auth_token,
    id: req.body.news_id
  }

  api_manager.postForm(url, member_cookie, form, res)
})

// 上傳新聞圖片
router.post('/post/news_photo', upload.single('photo'), function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/post/news_photo'

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let formData = {
    id: req.body.news_id,
    auth_token: req.body.auth_token,
    photo: {
      value: fs.createReadStream(req.file.path),
      options: {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      }
    },
    width: req.body.width,
    height: req.body.height
  }

  //因上傳照片, 故使用formData
  api_manager.postFormData( url, member_cookie, formData, res )
})

// 取得文章
router.post('/get/article', jsonParser, function( req, res ) {

  let host = constants.API_HOST
  let url = host + '/api/get/article'

  //cookie
  let member_cookie = ''

  //form
  let form = {
    id: req.body.article_id
  }

  api_manager.postForm(url, member_cookie, form, res)
})

// 取得文章列表
router.post('/get/articles', jsonParser, function( req, res ) {

  let host = constants.API_HOST
  let url = host + '/api/admin/get/article'

  //cookie
  let member_cookie = ''

  //form
  let form = {}

  req.body.theme_id == undefined ? null : form.mainboard_id = req.body.theme_id
  req.body.sub_theme_id == undefined ? null : form.subboard_id = req.body.sub_theme_id

  api_manager.postForm(url, member_cookie, form, res)
})

// 移動文章
router.post('/move/article', jsonParser, function( req, res ) {

  let host = constants.API_HOST
  let url = host + '/api/admin/update/article/move'

  // cookie
  let member_cookie = ''

  // form
  let formData = {
    'article_id[]': req.body.article_id,
    'subboard_id[]': req.body.subboard_id
  }

  api_manager.postFormData(url, member_cookie, formData, res)
})

// 刪除文章
router.post('/remove/article', jsonParser, function( req, res ) {

  let host = constants.API_HOST
  let url = host + '/api/admin/delete/article'

  // cookie
  let member_cookie = ''

  // formData
  let formData = {
    'article_id[]': req.body.article_id,
    'reason[]': req.body.reason
  }

  api_manager.postFormData(url, member_cookie, formData, res)
})

// 刪除回文
router.post('/remove/article_content', jsonParser, function( req, res ) {

  // url
  let url = constants.API_HOST + '/api/delete/article_content'

  // cookie
  let member_cookie = ''

  // form
  let formData = {
    'id': req.body.article_content_id,
    'reason': req.body.reason
  }

  api_manager.postForm(url, member_cookie, formData, res)
})

module.exports = router;
