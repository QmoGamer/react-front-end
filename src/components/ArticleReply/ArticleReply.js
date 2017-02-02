import React, { Component } from 'react'
import { apiLikeArticle, apiDislikeArticle } from '../../actions/article'
import styles from './ArticleReply.css'
import MemberTip from '../MemberTip/MemberTip'
import BtnAction from '../BtnAction/BtnAction'
import { yyyymmdd, isEmpty, checkImg } from '../../utils.js'
import ReactHtmlParser from 'react-html-parser'
const constants = require('../../constants');

class ArticleReply extends Component {

  constructor (props) {
    super(props)
    // console.log(props);
    this.state = { is_like: props.liked, enable: 1, likes: props.like_count }
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
  
  render () {
    // console.log(this.props)
    const { member, dispatch, user_id, content, article_content_id, userImage } = this.props

    const member_name = this.props.nickname
    const member_posts = this.props.user_article_count
    const member_follows = this.props.user_follow_count
    const member_pro_pic = checkImg( userImage )
    const article_post_date = yyyymmdd(this.props.post_time) 
    const is_follow = this.props.followed

    let is_like_css =  this.state.is_like == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action
    let likes = this.state.likes
    let render_btn_edit_content = null

    if( !isEmpty(member.member_info) )
      if( member.member_info.id == user_id )
        render_btn_edit_content = <div className={ styles.btn_action } onClick={ ()=>window.location.href="/article/edit/"+article_content_id }>編輯</div>

    return (
      <div className={styles.reply_block}>
        <div className={styles.reply_member_tip}>
          <MemberTip 
            member_name = {member_name}
            member_posts = {member_posts}
            member_follows = {member_follows}
            member_pro_pic = {member_pro_pic}
            article_post_date = {article_post_date}
            member = {member}
            dispatch = {dispatch}
            user_id = {user_id}
            is_follow = {is_follow}
          />
        </div>
        <div className={styles.reply_content}>{ ReactHtmlParser(content) }</div>
        <div className="flex">
          <div style={{"flex": "1"}} className={styles.reply_likes}>{likes}個讚</div>
          <div style={{"flex": "1"}}>{ render_btn_edit_content }</div>
          <div style={{"flex": "1"}}>
            <div onClick={()=>this.clickLike(member, article_content_id)} className={is_like_css}>讚</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ArticleReply