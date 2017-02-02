import React, { Component } from 'react'
import styles from './AuthorInfo.css'
import { apiFollowMember, apiUnfollowMember } from '../../actions/member'

class AuthorInfo extends Component {

  constructor (props) {
    super(props)
    // console.log(props);
    this.state = { is_follow: props.is_follow, enable: 1, follows: props.follows }
  }

  clickFollow ( member, user_id ) {

    if(this.state.enable == 1) {

      if( member.member_status != 2 ) {
        alert("請先登入會員")
        window.location.href = '/member_login'
      }

      let member_cookie = member.member_info.member_cookie
      let auth_token = member.member_info.token
      let is_follow = this.state.is_follow
      let follows = this.state.follows

      if( is_follow != 1 ) {
        this.props.dispatch( apiFollowMember(location.origin, member_cookie, auth_token, user_id) )
        this.setState({ is_follow: 1, enable: 0, follows: (follows + 1) })
      }
      else {
        this.props.dispatch( apiUnfollowMember(location.origin, member_cookie, auth_token, user_id) )
        this.setState({ is_follow: 0, enable: 0, follows: (follows - 1) })
      }

      setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 1000)
    }
  }

  render () {

    const { pro_pic, name, articles, member, user_id } = this.props

    let follows = this.state.follows
    let is_follow_css = this.state.is_follow == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action

    let btn_follow = <div onClick={()=>this.clickFollow(member, user_id)} className={is_follow_css}>追蹤</div>
    if( member.member_status == 2 && member.member_info.id == user_id ) {
      btn_follow = null
    }

    return (
      <div className={styles.author}>
        <div className={styles.author_pic}><img src={pro_pic} /></div>
        <div className={styles.author_info}>
          <div className={styles.author_name}>{name}</div>
          <div className={styles.author_articles}>{articles}篇文章</div>
          <div className={styles.author_follows}>{follows}人追蹤</div>
          { btn_follow }
        </div>
      </div>
    )
  }
}

export default AuthorInfo