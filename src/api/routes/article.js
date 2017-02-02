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

//發文
router.get('/post_article', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/article'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  let form = {
    'auth_token': req.query['member_token'],
    'subboard_id': '1', 
    'title': ' ',
    'type_id': '1'
  }

  request.post({url, jar: j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

//發文含內容
router.post('/post_article_content', jsonParser, function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/article_content'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.body.member_cookie);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.body.member_token,
    'article_id': req.body.article_id, 
    'content': req.body.content
  }

  request.post({url, jar: j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 更新標題&sub主題id
router.get('/update/article', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/update/article'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  let form = {
    'auth_token': req.query['member_token'],
    'id': req.query['article_id'],
    'subboard_id': req.query['sub_theme_id'],
    'title': req.query['title'],
    'isdraft': '0'
  }

  request.post({url, jar: j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取得文章
router.get('/get/article', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/article'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'id': req.query['article_id'],
    'auth_token': req.query['auth_token']
  }

  request.post({url, jar: j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 刪除文章
router.get('/delete/article', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/delete/article'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'id': req.query['article_id'],
    'auth_token': req.query['auth_token']
  }

  request.post({url, jar: j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
      let data = {
        "status": 9,
        "error": {
          "error_code": 99999999,
          "error_msg": "We’ve encountered an error: " + error
        }
      }
      res.json({ data: data, statusCode: response.statusCode })
    }
    else if ( response.statusCode == 500 ) {
      console.log("statusCode: " + response.statusCode);
      let data = {
        "status": 500,
        "error": {
          "error_code": 50000000,
          "error_msg": "500 Internal Server Error"
        }
      }
      res.json({ data: data, statusCode: response.statusCode })
    }
    else {
      res.json({ data: JSON.parse(body), statusCode: response.statusCode })
    }
  })
})

// 點讚
router.get('/post/like', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/like'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['auth_token'],
    'article_content_id': req.query['article_content_id']
  }

  request.post({url, jar: j, form: form }, function (error, response, body) {
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取消讚
router.get('/delete/like', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/delete/like'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['auth_token'],
    'article_content_id': req.query['article_content_id']
  }

  request.post({url, jar: j, form: form }, function (error, response, body) {
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 收藏
router.get('/post/collecting', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/collecting'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['auth_token'],
    'article_id': req.query['article_id']
  }

  request.post({url, jar: j, form: form }, function (error, response, body) {
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取消收藏
router.get('/delete/collecting', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/delete/collecting'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['auth_token'],
    'article_id': req.query['article_id']
  }

  request.post({url, jar: j, form: form }, function (error, response, body) {
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 上傳文章照片
router.post('/post/article_photo', upload.single('photo'), function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/post/article_photo'

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let formData = {
    id: req.body.article_id,
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

// 搜尋關鍵字
router.post('/search', jsonParser, function(req, res) {
  let page = req.body.page
  let host = constants.API_HOST
  let url = host + '/api/get/article/search/' + page

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    key_word: req.body.keyword,
    page_count: req.body.page_count
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 更新文章內容
router.post('/update/article_content', jsonParser, function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/update/article_content'

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    id: req.body.article_content_id,
    content: req.body.content
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 取得文章內容
router.post('/get/article_content', jsonParser, function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/article_content'

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    article_content_id: req.body.article_content_id
  }

  api_manager.postForm( url, member_cookie, form, res )
})

module.exports = router;
