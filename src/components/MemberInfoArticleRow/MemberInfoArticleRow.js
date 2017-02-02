import React, { Component } from 'react'
import styles from './MemberInfoArticleRow.css'
import { ver2_apiLikeArticle, ver2_apiDislikeArticle, ver2_apiCollectArticle, ver2_apiDeleteCollectArticle } from '../../actions/article'

export default class MemberInfoArticleRow extends Component {

	constructor (props) {
    super(props)
    this.state = { enable: 1, likes: props.data.likes, is_like: props.data.is_like, is_collect: props.data.is_collect }
  }

  clickLike ( enable, member, article_content_id, is_like, likes ) {

  	if( enable == 1 ) {

	    if( member.member_status == 2 ) {

		    let member_cookie = member.member_info.member_cookie
		    let auth_token = member.member_info.token

		    if( is_like == 1 ) {
		    	this.props.dispatch( ver2_apiDislikeArticle( location.origin, member_cookie, auth_token, article_content_id ) )
		    		.then( res => {

		    			res.data.status == 1 ? this.setState({ is_like: 0, enable: 0, likes: (likes - 1) }) : alert( res.data.error.error_msg )
		    		})
		    }
		    else {
		    	this.props.dispatch( ver2_apiLikeArticle( location.origin, member_cookie, auth_token, article_content_id ) )
		    		.then( res => {

		    			res.data.status == 1 ? this.setState({ is_like: 1, enable: 0, likes: (likes + 1) }) : alert( res.data.error.error_msg )
		    		})
		    }

		    setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 1000)
	    }
	    else {
	    	alert("請先登入會員")
	    	window.location.href = '/member_login'
		  }
	  }
  }

  clickCollect ( enable, member, article_id, is_collect ) {

  	if( enable == 1 ) {

	    if( member.member_status == 2 ) {

	    	let member_cookie = member.member_info.member_cookie
		    let auth_token = member.member_info.token

		    if( is_collect == 1 ) {
		    	this.props.dispatch( ver2_apiDeleteCollectArticle( location.origin, member_cookie, auth_token, article_id ) )
		    		.then( res => {

		    			res.data.status == 1 ? this.setState({ is_collect: 0, enable: 0 }) : alert( res.data.error.error_msg )
		    		})
		    }
		    else {
		    	this.props.dispatch( ver2_apiCollectArticle( location.origin, member_cookie, auth_token, article_id ) )
		    		.then( res => {

		    			res.data.status == 1 ? this.setState({ is_collect: 1, enable: 0 }) : alert( res.data.error.error_msg )
		    		})
		    }

		    setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 1000)
	    }
	    else {
	    	alert("請先登入會員")
	    	window.location.href = '/member_login'
	    }
	  }
  }

  toggleEdit ( bool, type ) {

    if ( bool == true && type == 'desktop' ) {
      this.refs['desktop_edit'].style.display = "block"
      this.refs['desktop_mask'].style.display = "block"
      this.refs['desktop_icon'].style.backgroundColor = "red"
      this.refs['desktop_icon'].className = "rows_edit_img active"
    }
    else if ( bool == true && type == 'mobile' ) {
      this.refs['mobile_edit'].style.display = "block"
      this.refs['mobile_mask'].style.display = "block"
      this.refs['mobile_icon'].style.backgroundColor = "red"
      this.refs['mobile_icon'].className = "rows_edit_img active"
    }
    else if ( bool == false && type == 'desktop' ) {
      this.refs['desktop_edit'].style.display = "none"
      this.refs['desktop_mask'].style.display = "none"
      this.refs['desktop_icon'].style.backgroundColor = "#eee"
      this.refs['desktop_icon'].className = "rows_edit_img"
    }
    else if ( bool == false && type == 'mobile' ) {
      this.refs['mobile_edit'].style.display = "none"
      this.refs['mobile_mask'].style.display = "none"
      this.refs['mobile_icon'].style.backgroundColor = "#eee"
      this.refs['mobile_icon'].className = "rows_edit_img"
    }
  }

  render () {

  		const { 
  			article_id,
  			article_content_id,
  			photo, 
  			title, 
  			mainboard_id, 
  			mainboard_name,
  			subboard_id,
  			subboard_name,
  			user_response_count,
  			post_time,
  			edit_time,
  			member
  		} = this.props.data

  		const {
  			enable,
  			likes,
  			is_like,
  			is_collect
  		} = this.state

  		let is_like_css =  is_like == 1 ? "btn_action_gray active" : "btn_action_gray"
  		let is_collect_css =  is_collect == 1 ? "btn_action_gray active" : "btn_action_gray"

			return (
				<div className="rows_type1">
          <div className={ styles.desktop }>
            <div style={{ flex: "1.5" }} className={ styles.tbody_photo_cover }><img src={ photo } /></div>
            <div style={{ flex: "5" }} className={ "ellipsis " + styles.tbody_title }>{ title }</div>
            <div style={{ flex: "3" }} className={ "ellipsis " + styles.tbody_theme }>
              <a href={ "/theme/" + mainboard_id }> { mainboard_name } </a>
              >
              <a href={ "/theme/" + mainboard_id + " / " + subboard_id }> { subboard_name } </a>
            </div>
            <div style={{ flex: "1", textAlign: "center" }}>{ likes }</div>
            <div style={{ flex: "1", textAlign: "center" }}>{ user_response_count }</div>
            <div style={{ flex: "2", textAlign: "center" }}>{ post_time }</div>
            <div style={{ flex: "2", textAlign: "center" }}>{ edit_time }</div>
            <div style={{ width: "32px" }}>
              <div ref={"desktop_icon"} className="rows_edit_img" onClick={ ()=> this.toggleEdit( true, 'desktop' ) }>
              	<div ref={"desktop_edit"} className="rows_edit" style={{ padding: "0" }}>
              		<div className={ is_like_css } onClick={ ()=> this.clickLike( enable, member, article_content_id, is_like, likes ) }>讚</div>
                	<div className={ is_collect_css } onClick={ ()=> this.clickCollect ( enable, member, article_id, is_collect ) }>收藏</div>
              	</div>
              </div>
              <div ref={"desktop_mask"} className="mask" onClick={ ()=> this.toggleEdit( false, 'desktop' ) }></div>
            </div>
          </div>
          <div className={ styles.mobile }>
            <div className="flex flex_jc_sb">
              <div>{ post_time }</div>
              <div>{ edit_time }</div>
            </div>
            <div className="flex">
              <div style={{ flex: "1" }} className={ styles.tbody_photo_cover }><img src={ photo } /></div>
              <div style={{ flex: "2", paddingRight: "4px" }}>
                <div className={ "ellipsis " + styles.tbody_title }>{ title }</div>
                <div className={ "ellipsis " + styles.tbody_theme }>
                  <a href={ "/theme/" + mainboard_id }> { mainboard_name } </a>
                  >
                  <a href={ "/theme/" + mainboard_id + " / " + subboard_id }> { subboard_name } </a>
                </div>
                <div style={{ fontSize: "12px" }}>
                  { likes }讚  { user_response_count }回文
                </div>
              </div>
              <div style={{ width: "32px" }}>
                <div ref={"mobile_icon"} className="rows_edit_img" onClick={ ()=> this.toggleEdit( true, 'mobile' ) }>
                  <div ref={"mobile_edit"} className="rows_edit" style={{ padding: "0" }}>
	              		<div className={ is_like_css } onClick={ ()=> this.clickLike( enable, member, article_content_id, is_like, likes ) }>讚</div>
	                	<div className={ is_collect_css } onClick={ ()=> this.clickCollect ( enable, member, article_id, is_collect ) }>收藏</div>
	              	</div>
                </div>
                <div ref={"mobile_mask"} className="mask" onClick={ ()=> this.toggleEdit( false, 'mobile' ) }></div>
              </div>
            </div>
          </div>
        </div>
			)
	 }
}