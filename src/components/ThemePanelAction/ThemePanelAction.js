import React, { Component } from 'react'
import styles from './ThemePanelAction.css'
import { apiLikeArticle, apiDislikeArticle, apiCollectArticle, apiDeleteCollectArticle } from '../../actions/article'
import LikesTip from '../LikesTip/LikesTip'

class ThemePanelAction extends Component {

	constructor (props) {
    super(props)
    // console.log(props);
    this.state = { is_like: props.is_like, is_collect: props.is_collect, enable: 1, likes: props.likes }
  }

  clickLike ( member, article_content_id ) {

  	if(this.state.enable == 1) {

	    if( member.member_status != 2 ) {
	    	alert("請先登入會員")
	    	window.location.href = '/member_login'
	    }

	    let member_cookie = member.member_info.member_cookie
	    let auth_token = member.member_info.token
	    let is_like = this.state.is_like
	    let likes = this.state.likes

	    if( is_like != 1 ) {
	    	this.props.dispatch( apiLikeArticle(location.origin, member_cookie, auth_token, article_content_id) )
	    	this.setState({ is_like: 1, enable: 0, likes: (likes + 1) })
	    }
	    else {
	    	this.props.dispatch( apiDislikeArticle(location.origin, member_cookie, auth_token, article_content_id) )
	    	this.setState({ is_like: 0, enable: 0, likes: (likes - 1) })
	    }

	    setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 1000)
	  }
  }

  clickCollect ( member, article_id ) {

  	if(this.state.enable == 1) {

	    if( member.member_status != 2 ) {
	    	alert("請先登入會員")
	    	window.location.href = '/member_login'
	    }

	    let member_cookie = member.member_info.member_cookie
	    let auth_token = member.member_info.token
	    let is_collect = this.state.is_collect

	    if( is_collect != 1 ) {
	    	this.props.dispatch( apiCollectArticle(location.origin, member_cookie, auth_token, article_id) )
	    	this.setState({ is_collect: 1, enable: 0 })
	    }
	    else {
	    	this.props.dispatch( apiDeleteCollectArticle(location.origin, member_cookie, auth_token, article_id) )
	    	this.setState({ is_collect: 0, enable: 0 })
	    }

	    setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 1000)
	  }
  }

  render () {

  		const { member, msgs, article_id, article_content_id } = this.props

  		let likes = this.state.likes
  		let is_like_css =  this.state.is_like == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action
  		let is_collect_css =  this.state.is_collect == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action

			return (
				<div>
					<LikesTip likes={likes} msgs={msgs} />
					<div style={{display: "flex"}}>
						<div onClick={()=>this.clickLike(member, article_content_id)} className={is_like_css}>讚</div>
						<div onClick={()=>this.clickCollect(member, article_id)} className={is_collect_css}>收藏</div>
					</div>
				</div>
			)
	 }
}

export default ThemePanelAction