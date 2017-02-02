var request = require("request");
var j = request.jar();
const constants = require('../../constants');

function responseHandle( error, response, body, res ) {

  if (error) {
    console.log("We’ve encountered an error: " + error);
    let data = {
      "status": 0,
      "error": {
        "error_code": 99999999,
        "error_msg": "Server Error"
      }
    }
    res.json({ data: data, statusCode: 999 })
  }
  else if ( response.statusCode == 500 ) {
    // console.log("statusCode: " + response.statusCode);
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
    // console.log("statusCode: " + response.statusCode);
    res.json({ data: JSON.parse(body), statusCode: response.statusCode })
  }
}

function setHeaderCookie( url, member_cookie ) {

  let cookie = request.cookie( member_cookie )
  j.setCookie( cookie, url )
}

// form
function postForm( url, cookie, form, res ) {

  setHeaderCookie( url, cookie )

	request.post({url: url, jar: j, form: form, timeout: 10000}, function (error, response, body) {

    responseHandle( error, response, body, res )
  })
}

// formData for multipart-data
function postFormData( url, cookie, formData, res ) {

  setHeaderCookie( url, cookie )

  request.post({url: url, jar: j, formData: formData, timeout: 10000}, function (error, response, body) {

    responseHandle( error, response, body , res )
  })
}

module.exports = { postForm, postFormData };
