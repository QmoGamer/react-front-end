import React, { Component } from 'react'
import styles from './MemberTip.css'
import { apiFollowMember, apiUnfollowMember } from '../../actions/member'

class MemberTip extends Component {

  constructor (props) {
    super(props)
    // console.log(props);
    this.state = { is_follow: props.is_follow, enable: 1, follows: props.member_follows }
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

    const { member_name, member_posts, member_pro_pic, article_post_date, member, user_id } = this.props

    let member_follows = this.state.follows
    let is_follow_css = this.state.is_follow == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action

    let btn_follow = <div onClick={()=>this.clickFollow(member, user_id)} className={is_follow_css}>追蹤</div>
    if( member.member_status == 2 && member.member_info.id == user_id ) {
      btn_follow = null
    }

    return (
    		<div className={styles.member_info_bg}>
          <div className={styles.member_info}>
            <img width="40px" height="40px" src={member_pro_pic} style={{"marginRight": "0.5rem"}} />
            <span>{member_name}</span>  
            <div className={styles.member_info_tip}>
              <div className={styles.tip_padding}>
                <a href={ "/member_info/" + user_id + "/1" }>
                  <img width="40px" height="40px" src={member_pro_pic} style={{"marginRight": "1rem"}} />
                </a>
                <div>
                  <a href={ "/member_info/" + user_id + "/1" }>
                    <div className={styles.tip_name}>{member_name}</div>
                  </a>
                  <div className={styles.tip_sub}>{member_posts}篇文章 {member_follows}個人追蹤</div>
                </div>
              </div>
              <div className="flex">
                { btn_follow }
              </div>
            </div>
          </div>
          <div>{article_post_date}</div>
        </div>
    )
  }
}

export default MemberTip