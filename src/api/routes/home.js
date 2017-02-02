var express = require('express');
var router = express.Router();
var request = require("request");

var api_manager = require('./api_manager')
const constants = require('../../constants');

//取得新聞
router.post('/news', function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/get/news'

  //cookie
  let member_cookie = ''

  // //form
  let form = {
    type_id: "2"
  }

  api_manager.postForm( url, member_cookie, form, res )
})
// router.get('/news', function(req, res) {
//   let host = constants.API_HOST
//   let url = host + '/api/get/news'

//   request.post({url, form: { 'type_id': "2" }}, function (error, response, body) {
//     if( response.statusCode == 200 || response.statusCode == 400 ) {
//       res.json({ news: JSON.parse(body) })
//     }
//     else {
//       res.json({ news: {"status":"0", "error": {"error_code": "00001"}} })
//     }
//   });
// });

//取得公告
router.post('/announcement', function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/get/news'

  //cookie
  let member_cookie = ''

  // //form
  let form = {
    type_id: "1"
  }

  api_manager.postForm( url, member_cookie, form, res )
})
// router.get('/announcement', function(req, res) {
//   let host = constants.API_HOST
//   let url = host + '/api/get/news'

//   request.post({url, form: { 'type_id': "1" }}, function (error, response, body) {
//     if( response.statusCode == 200 || response.statusCode == 400 ) {
//       res.json({ announcement: JSON.parse(body) })
//     }
//     else {
//       res.json({ announcement: {"status":"0", "error": {"error_code": "00001"}} })
//     }
//   });
// });

//取得主題分類
router.get('/theme', function(req, res) {
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

//取得主題文章
router.get('/theme_article', function(req, res) {
  let host = constants.API_HOST
  let url = host + '/api/get/article/time'

  //cookie
  var j = request.jar();
  var cookie = request.cookie(req.query['member_cookie']);
  j.setCookie(cookie, url);

  //form
  let form = {
    'timestamp': new Date().getTime(),
    'stamp': 'before',
    'mainboard_id': req.query['theme_id']
  }

  request.post({url, jar: j, form: form}, function (error, response, body) {
    if (error) {
      console.log("We’ve encountered an error: " + error);
    }
    res.json({ theme_article: JSON.parse(body), statusCode: response.statusCode })

    // if( response.statusCode == 200 || response.statusCode == 400 ) {
    //   res.json({ theme_article: JSON.parse(body) })
    // }
    // else {
    //   res.json({ theme_article: {"status":"0", "error": {"error_code": "00001"}} })
    // }
  });
});

module.exports = router;
