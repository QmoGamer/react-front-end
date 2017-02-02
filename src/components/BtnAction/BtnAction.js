import React, { Component } from 'react'
import styles from './BtnAction.css'
import { apiLikeArticle, apiDislikeArticle, apiCollectArticle, apiDeleteCollectArticle } from '../../actions/article'

class BtnAction extends Component {

	constructor (props) {
    super(props)
    // console.log(props);
    this.state = { active: props.active, enable: 1 }
  }

  clickLike ( member, article_content_id, active ) {

  	if(this.state.enable == 1) {

	    if( member.member_status != 2 ) {
	    	alert("請先登入會員")
	    	window.location.href = '/member_login'
	    }

	    let member_cookie = member.member_info.member_cookie
	    let auth_token = member.member_info.token
	    if( active != 1 ) {
	    	this.props.dispatch( apiLikeArticle(location.origin, member_cookie, auth_token, article_content_id) )
	    	this.setState({ active: 1, enable: 0 })
	    }
	    else {
	    	this.props.dispatch( apiDislikeArticle(location.origin, member_cookie, auth_token, article_content_id) )
	    	this.setState({ active: 0, enable: 0 })
	    }

	    setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 2000)
	  }
  }

  clickCollect ( member, article_id, active ) {
  	console.log(article_id);
  	if(this.state.enable == 1) {

	    if( member.member_status != 2 ) {
	    	alert("請先登入會員")
	    	window.location.href = '/member_login'
	    }

	    let member_cookie = member.member_info.member_cookie
	    let auth_token = member.member_info.token
	    if( active != 1 ) {
	    	this.props.dispatch( apiCollectArticle(location.origin, member_cookie, auth_token, article_id) )
	    	this.setState({ active: 1, enable: 0 })
	    }
	    else {
	    	this.props.dispatch( apiDeleteCollectArticle(location.origin, member_cookie, auth_token, article_id) )
	    	this.setState({ active: 0, enable: 0 })
	    }

	    setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 5000)
	  }
  }

  // clickFollow ( member_cookie, auth_token, active, type, user_id, active ) {

  // }

  render () {

  		const { member, type, article_content_id, article_id, user_id } = this.props
  		let active = this.state.active
  		let css = active == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action
  		let render_btn = null

  		switch( type ) {
  			case '1':
  				render_btn = <div onClick={()=>this.clickLike(member, article_content_id, active)} className={css}>{this.props.text}</div>
  				break;
  			case '2':
  				render_btn = <div onClick={()=>this.clickCollect(member, article_id, active)} className={css}>{this.props.text}</div>
  				break;
  			// case '3':
  			// 	render_btn = <div onClick={()=>this.clickFollow(member, user_id, active)} className={css}>{this.props.text}</div>
  				break;
  			default :
  				render_btn = <div className={css}>{this.props.text}</div>
  				break;
  		} 

			return render_btn
	 }
}

export default BtnAction