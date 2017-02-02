var express = require('express');
var router = express.Router();
var request = require("request");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var fs = require('fs')
var Buffer = require('buffer').Buffer;

var api_manager = require('./api_manager');
const constants = require('../../constants');

//註冊會員
router.post('/memberRegister', jsonParser, function(req, res) {
  
  let host = constants.API_HOST
  let url = host + '/api/register'

  //cookie
  let member_cookie = ''

  //form
  let form = {
    nickname: req.body.name,
    email: req.body.email,
    password: new Buffer(req.body.password, 'base64').toString(),
    company: req.body.company_name,
    job_title: req.body.job_title
  }

  api_manager.postForm(url, member_cookie, form, res);
})

//登入會員
router.post('/memberSignIn', jsonParser, function(req, res) {

  let url = constants.API_HOST + '/api/login'

  var j = request.jar()

  //form
  let form = {
    'email': req.body.email,
    'password': new Buffer(req.body.password, 'base64').toString(),
  }

  request.post({url, jar: j, form: form}, function (error, response, body) {

    if (error) {
      console.log("We’ve encountered an error: " + error);
      let data = {
        "status": 0,
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
        "status": 0,
        "error": {
          "error_code": 50000000,
          "error_msg": "500 Internal Server Error"
        }
      }
      res.json({ data: data, statusCode: response.statusCode })
    }
    else {
      var cookie_string = j.getCookieString(url)
      // console.log(cookie_string);
      res.append('Set-Cookie', cookie_string)
      res.json({ data: JSON.parse(body), statusCode: response.statusCode, member_cookie: cookie_string })
    }
  })
})

//會員登出
router.get('/sign/out', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/logout'

  //cookie 
  let member_cookie = req.query['member_cookie']

  api_manager.postForm(url, member_cookie, {}, res);
})

// 追蹤
router.get('/follow_member', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/post/follow'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['member_token'],
    'user_id': req.query['user_id']
  }

  request.post({url, jar: j, form: form }, function (error, response, body) {
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取消追蹤
router.get('/unfollow_member', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/delete/follow'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['member_token'],
    'user_id': req.query['user_id']
  }

  request.post({url, jar: j, form: form }, function (error, response, body) {
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取得我的收藏
router.get('/get/collect', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/collecting/' + req.query['page']

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['member_token']
  }

  request.post({ url, jar: j, form: form }, function (error, response, body) {
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取得我的發文
router.get('/get/post', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/article/user/' + req.query['page']

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['member_token'],
    'user_id': req.query['user_id'],
    'page_count': req.query['page_count']
  }

  request.post({url, jar: j, form: form }, function (error, response, body) {
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// 取得我的追蹤
router.get('/get/follow', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/follow/' + req.query['page']

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'auth_token': req.query['member_token']
  }

  request.post({ url, jar: j, form: form }, function (error, response, body) {
    
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  })
})

// ver2 取得我的追蹤
router.post('/get/follow', jsonParser, function(req, res) {

  // url
  let url = constants.API_HOST + '/api/get/follow/' + req.body.page

  // cookie
  let member_cookie = req.body.member_cookie

  // form
  let form = {
    auth_token: req.body.auth_token,
    page_count: req.body.page_count
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// login check
router.get('/login_check', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/login_check'

  //cookie
  let member_cookie = req.query['member_cookie']

  //form
  let form = {
    'auth_token': req.query['member_token']
  }

  api_manager.postForm(url, member_cookie, form, res);
})

// 取得會員文章
router.post('/get/user/article', jsonParser, function(req, res) {

  let page = req.body.page

  let host = constants.API_HOST
  let url = host + '/api/get/article/user/' + page

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    user_id: req.body.user_id,
    page_count: req.body.page_count
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 取得會員資訊
router.post('/get/user/info', jsonParser, function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/get/article/user'

  //cookie
  let member_cookie = req.body.member_cookie

  //form
  let form = {
    auth_token: req.body.auth_token,
    user_id: req.body.user_id
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 忘記密碼
router.post('/forgot/password', jsonParser, function(req, res) {

  // url
  let url = constants.API_HOST + '/api/forget_pw'

  // cookie
  let member_cookie = ''

  // form
  let form = {
    email: req.body.email
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 重置密碼
router.post('/reset/password', jsonParser, function(req, res) {

  // url
  let url = constants.API_HOST + '/api/forget_pw_change'

  // cookie
  let member_cookie = ''

  // form
  let form = {
    email: req.body.email,
    token: req.body.token,
    new_password: req.body.new_password,
    new_password_repeat: req.body.confirm_password
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 驗證信箱
router.post('/authenticate', jsonParser, function(req, res) {

  // url
  let url = constants.API_HOST + '/api/authenticate'

  // cookie
  let member_cookie = ''

  // form
  let form = {
    email: req.body.email,
    token: req.body.token
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 修改會員資料
router.post('/update/info', jsonParser, function(req, res) {

  // url
  let url = constants.API_HOST + '/api/update/user'

  // cookie
  let member_cookie = req.body.member_cookie

  // form
  let form = {
    token: req.body.token
  }

  switch( req.body.type ) {

    case 'name':
      form.nickname = req.body.value
      break;
    case 'company_name':
      form.company = req.body.value
      break;
    case 'job_title':
      form.job_title = req.body.value
      break;
    default:
      break;
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 修改會員大頭貼 
router.post('/update/pic_pro', upload.single('photo'), function(req, res) {

  // url
  let url = constants.API_HOST + '/api/update/user'

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let formData = {
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

// 修改密碼
router.post('/update/password', jsonParser, function(req, res) {

  // url
  let url = constants.API_HOST + '/api/update/password'

  // cookie
  let member_cookie = req.body.member_cookie

  // form
  let form = {
    auth_token: req.body.auth_token,
    password: req.body.password,
    new_password: req.body.new_password,
    new_password_repeat: req.body.confirm_password
  }

  api_manager.postForm( url, member_cookie, form, res )
})

module.exports = router;

// 解密
// function decrypt( string ) {

//   let new_string = ''

//   for (var i = 0; i < string.length; i++) {
//     new_string += String.fromCharCode( ( string.charCodeAt(i) / 3 ) )
//     console.log(new_string)
//   }

//   return new_string
// }
