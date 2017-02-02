const constants = require('./constants')

function isEmpty (data) {
	if(data === undefined || !Object.keys(data).length ){
		return true
	}
	return false
}

function DatetimeToMsgTime(datetime) {
	let t1 = new Date(datetime)
	let t2 = new Date()
	let msg_time = "剛剛"

	let minus_year = t2.getFullYear() - t1.getFullYear()
	let minus_month = t2.getMonth() - t1.getMonth()
	let minus_date = t2.getDate() - t1.getDate()
	let minus_hour = t2.getHours() - t1.getHours()
	let minus_minute = t2.getMinutes() - t1.getMinutes()
	let minus_second = t2.getSeconds() - t1.getSeconds()

	let diff_time = Math.ceil((t2 - t1) / 1000)
	
	if( diff_time > 0 && diff_time < 60 ) {
		msg_time = diff_time+"秒前"
	}
	else if( diff_time >= 60 && diff_time < 3600 ) {
		msg_time = Math.floor((diff_time / 60))+"分鐘前"
	}
	else if( diff_time >= 3600 && diff_time < 86400 ) {
		msg_time = Math.floor((diff_time / 60 / 60))+"個小時前"
	}
	else if( diff_time >= 86400 && diff_time < 172800 ) {
		msg_time = "昨天"
	}
	else if( diff_time >= 172800 && diff_time < 259200 ) {
		msg_time = "前天"
	}
	else if( diff_time >= 259200 && diff_time < 2592000 ) {
		msg_time = Math.floor((diff_time / 60 / 60 / 24))+"天前"
	}
	else if( diff_time >= 2592000 ) {
		msg_time = t1.getFullYear() + "年" + (t1.getMonth() + 1) + "月" + t1.getDate() + "日"
	}

	return msg_time
}

function isEmail(value) {
	let reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
	if ( reg.test( value ) && !isEmpty( value ) ) {
    return true
  }
  return false
}

function isPassword(value) {
	var reg = /[^a-zA-Z0-9]/;
  if ( !reg.test( value ) && !isEmpty( value ) ){
    return true
  }
  return false
}

function isChinese ( value ) {
  var reg = /[^\u4e00-\u9fa5]/;
  if ( !reg.test( value ) && !isEmpty( value ) ){
    return true
  }
  return false
}

function isValidSize ( size ) {

	if ( size < 2000000 ) {
		return true
	}
	return false
}

function isPhotoType ( type ) {

	if ( type == "image/png" || type == "image/jpeg" ) {
		return true
	}
	return false
}

function yyyymmdd( value ) {
	let d = new Date( value )
	let month = d.getMonth() + 1
 	let day = d.getDate()


	return d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day
}

function combineContentValue( content_value, src ) {

	return content_value += '<img src="' + src + '" />'
}

function arrayPaging ( page, total_page ) {
  
  let start_btn = 1
  let end_btn = total_page
  let array = []
  let offset = 3

  if( total_page > ((offset * 2) + 1) ) {

    //page < offset 
    if( page <= ( offset + 1 ) ) {
      end_btn = 7
    }
    else if ( total_page < ( page + offset ) ) {
      start_btn = ( total_page - (offset * 2) )
    }
    else {
      start_btn = ( page - offset )
      end_btn = ( page + offset )
    }
  }
  
  for( let i = start_btn; i <= end_btn; i++ ) {
    array.push(i)
  }

  return array
}

function getSessionStorageItem () {

	let json = {
    "member_cookie": window.sessionStorage.getItem("cookie"),
    "nickname": window.sessionStorage.getItem("nickname"),
    "photo_path": window.sessionStorage.getItem("photo_path"),
    "token": window.sessionStorage.getItem("token"),
    "id": window.sessionStorage.getItem("id"),
    "company_name": window.sessionStorage.getItem("company_name"),
    "job_title": window.sessionStorage.getItem("job_title"),
    "register_time": window.sessionStorage.getItem("register_time"),
    "email": window.sessionStorage.getItem("email")
  }

  return json
}

function checkImg ( value ) {

	// return ( value == '' || value == 'null' || value == null ) ? constants.VIEW_ICON_TEMP_MEMBER : constants.DOMAIN_HOST + value
	return ( value == '' || value == 'null' || value == null ) ? constants.VIEW_ICON_TEMP_MEMBER : constants.UPLOAD_IMG_URL + value
}

module.exports = { 
	isEmpty, 
	DatetimeToMsgTime, 
	isEmail, 
	isPassword, 
	isChinese, 
	isValidSize, 
	isPhotoType, 
	yyyymmdd, 
	combineContentValue,
	arrayPaging,
	getSessionStorageItem,
	checkImg
}