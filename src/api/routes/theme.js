var express = require('express')
var router = express.Router()
var request = require("request")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var api_manager = require('./api_manager')
const constants = require('../../constants')

// 最新主題文章
router.post('/theme_article/new', jsonParser, function(req, res) {
  
  let host = constants.API_HOST
  let url = host + '/api/get/article/time/' + req.body.page

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    mainboard_id: req.body.theme_id,
    page_count: req.body.page_count,
    timestamp: req.body.timestamp,
    stamp: req.body.stamp
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 熱門主題文章
router.post('/theme_article/hot', jsonParser, function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/get/article/hot/' + req.body.page

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    mainboard_id: req.body.theme_id,
    page_count: req.body.page_count
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 最新sub主題文章
router.post('/sub_theme_article/new', jsonParser, function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/get/article/time/' + req.body.page

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    subboard_id: req.body.sub_theme_id,
    page_count: req.body.page_count,
    timestamp: req.body.timestamp,
    stamp: req.body.stamp
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 熱門sub主題文章
router.post('/sub_theme_article/hot', jsonParser, function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/get/article/hot/' + req.body.page

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    subboard_id: req.body.sub_theme_id,
    page_count: req.body.page_count
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 首頁最新主題文章
router.post('/home_theme_article/new', jsonParser, function(req, res) {
  
  let host = constants.API_HOST
  let url = host + '/api/get/article/time/1'

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    page_count: req.body.page_count,
    timestamp: req.body.timestamp,
    stamp: req.body.stamp
  }

  api_manager.postForm( url, member_cookie, form, res )
})

// 首頁熱門主題文章
router.post('/home_theme_article/hot', jsonParser, function(req, res) {

  let host = constants.API_HOST
  let url = host + '/api/get/article/hot/1'

  //cookie
  let member_cookie = req.body.member_cookie

  // //form
  let form = {
    auth_token: req.body.auth_token,
    page_count: req.body.page_count
  }

  api_manager.postForm( url, member_cookie, form, res )
})

module.exports = router;
