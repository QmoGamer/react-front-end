import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { apiGetUserArticle, apiGetUserInfo, apiFollowMember, apiUnfollowMember } from '../../actions/member'
import styles from './MemberInfo.css'
import { isEmpty, DatetimeToMsgTime, yyyymmdd, checkImg } from '../../utils'
import Loader from '../../components/Loader/Loader'
const constants = require('../../constants')

import IconTitle from '../../components/IconTitle/IconTitle'
import Ad from '../../components/Ad/Ad'
import BtnPage from '../../components/BtnPage/BtnPage'
import MemberInfoArticleRow from '../../components/MemberInfoArticleRow/MemberInfoArticleRow'

class MemberInfo extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      loading: 1, 
      user_info: false,
      article_list: false,
      enable: 1,
      is_follow: 0,
      follows: 0
    }
  }

  componentDidMount () {

    const { user_id, page } = this.props.params
    let member_cookie = window.sessionStorage.getItem("cookie") || ''
    let auth_token = window.sessionStorage.getItem("token") || ''

    this.dispatchGetUserArticle( member_cookie, auth_token, user_id, page )

    this.props.dispatch( apiGetUserInfo( location.origin, member_cookie, auth_token, user_id ) )
      .then( res => {

        if( res.data.status == 1 ) {

          if( res.data.result.length == 0 ) {

             window.location.href = '/'
          }
          else {

            let user_info = res.data.result[0]
            this.setState({ user_info: user_info, is_follow: user_info.followed, follows: user_info.user_follow_count })
          }
        }
        else 
          alert( res.data.error.error_msg )
      })
  }

  componentWillReceiveProps (nextProps) {

    if( nextProps.params.page != this.props.params.page ) {

      this.setState({ loading: 1, article_list: false })

      const { user_id, page } = nextProps.params
      let member_cookie = window.sessionStorage.getItem("cookie") || ''
      let auth_token = window.sessionStorage.getItem("token") || ''

      this.dispatchGetUserArticle( member_cookie, auth_token, user_id, page )
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log(this.state);
    const{ article_list, user_info, loading } = this.state

    if ( article_list != false && user_info != false && loading == 1 ) {

      this.setState({ loading: 0 })
    }
  }

  dispatchGetUserArticle( member_cookie, auth_token, user_id, page ) {

    this.props.dispatch( apiGetUserArticle( location.origin, member_cookie, auth_token, user_id, page ) )
      .then( res => {

        if( res.data.status == 1 ) {

          res.data.result.page_content == null ? window.location.href = "/" : this.setState({ article_list: res.data.result })
        }
        else 
          alert( res.data.error.error_msg )
      })
  }

  clickFollow ( user_id, member ) {

    if( this.state.enable == 1 ) {

      if( member.member_status == 2 ) {

        let member_cookie = member.member_info.member_cookie
        let auth_token = member.member_info.token
        let is_follow = this.state.is_follow
        let follows = this.state.follows

        if( is_follow == 1 ) {
          this.props.dispatch( apiUnfollowMember( location.origin, member_cookie, auth_token, user_id ) )
          this.setState({ is_follow: 0, enable: 0, follows: (follows - 1) })
        }
        else {
          this.props.dispatch( apiFollowMember( location.origin, member_cookie, auth_token, user_id ) )
          this.setState({ is_follow: 1, enable: 0, follows: (follows + 1) })
        }
      }
      else {
        alert("請先登入會員")
        window.location.href = '/member_login'
      }

      setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 1000)
    }
  }

  renderTitle( user_info ) {

    return <IconTitle icon_classname="fa fa-home" title={ user_info.nickname + "的會員基本資訊" } color="#000" />
  }

  renderMember( user_info, member ) {
    // console.log(member)
    let user_path = checkImg( user_info.photo_path )
    let follows = this.state.follows
    let render_btn_follow = this.renderBtnFollow( user_info.user_id, member )

    if( member.member_status == 2 ) {
      if( member.member_info.id == user_info.user_id ) {
        render_btn_follow = null
      }
    }

    let render =  <div className={styles.info_box3}>
                    <div className={styles.info_box5}>
                      <div className={styles.user_pro_pic}><img width="150px" height="150px" src={ user_path } /></div>
                      { render_btn_follow }
                    </div>
                    <div className={styles.info_box6}>
                      <div className={styles.info_box7}>
                        <div className={styles.font_type1}>會員基本資訊</div>
                        <div>會員名稱: {user_info.nickname}</div>
                        <div style={{ display: "none" }}>會員等級: 1</div>
                        <div>註冊日期: { yyyymmdd(user_info.user_register_time) }</div>
                        <div>登入日期: { yyyymmdd(user_info.user_last_login) }</div>
                      </div>
                      <div className={styles.info_box7}>
                        <div className={styles.font_type1}>活躍</div>
                        <div>發表文章: {user_info.user_post_count}</div>
                        <div>回覆文章: {user_info.user_response_count}</div>
                        <div>追蹤人數: {follows}</div>
                      </div>
                    </div>
                  </div>

    return render
  }

  renderName( user_info ) {

    return <div className={ styles.title }>{ user_info.nickname + "發表過的文章" }</div>
  }

  renderList( article_list, member ) {
    // console.log(article_list)
    let render =  article_list.page_content.map((x, y) => {

                    if( x.content.length == 0 ) {

                      return <div key={ "article_list_" + y } className="rows_type1">{ constants.VIEW_TEXT_ARTICLE_1 }</div>
                    }
                    else {

                      let photo = x.path != null ? constants.API_HOST + x.path : constants.VIEW_LIST_PHOTO_COVER
                      let data = {
                        article_id: x.article_id,
                        article_content_id: x.content[0].article_content_id,
                        photo: photo,
                        title: x.title,
                        mainboard_id: x.mainboard_id,
                        mainboard_name: x.mainboard_name,
                        subboard_id: x.subboard_id,
                        subboard_name: x.subboard_name,
                        likes: x.content[0].like_count,
                        user_response_count: x.user_response_count,
                        post_time: yyyymmdd( x.post_time ),
                        edit_time: yyyymmdd( x.edit_time ),
                        is_like: x.content[0].liked,
                        is_collect: x.collected,
                        member: member
                      }

                      return <MemberInfoArticleRow key={ "article_list_" + y } data={ data } dispatch={ this.props.dispatch } />
                    }
                  })
    return render
  }

  renderPage( article_list ) {

    let user_id = this.props.params.user_id

    return <BtnPage page={ parseInt( article_list.page ) } total_page={ parseInt( article_list.total_page ) } path={ "/member_info/" + user_id } />
  }

  renderBtnFollow( user_id, member ) {

    let follow_text = this.state.is_follow == 1 ? "已追蹤" : "追蹤"
    let follow_css = this.state.is_follow == 1 ? "btn_action_gray active" : "btn_action_gray"

    return <div className={follow_css} onClick={()=> this.clickFollow( user_id, member ) }>{ follow_text }</div>
  }

  render () {
    // console.log(this.props);
    let render_title = <Loader />
    let render_member = <Loader />
    let render_list = <Loader />
    let render_page = <Loader />
    let render_name = <Loader />

    const { article_list, user_info, loading } = this.state
    const { member } = this.props

    if( loading == 0 ) {

      render_title = this.renderTitle( user_info )
      render_member = this.renderMember( user_info, member )
      render_list = this.renderList( article_list, member )
      render_page = this.renderPage( article_list )
      render_name = this.renderName( user_info )
    }

    return (
      <div className={styles.member_info}>
        <div style={{ padding: "10px 0 20px 0", fontSize: "16px", fontWeight: "bold" }}>
          { render_title }
        </div>
        <div className={styles.bg}>
          <div className={styles.border + " " + styles.info_box1}>
            { render_member }
            <div className={styles.info_box4}>
              <div><Ad path="/public/ad/ad22.jpg" width="300px" /></div>
            </div>
          </div>
          <div className={styles.border + " " + styles.info_box2}>
            { render_name }
            <div className={ "rows_type1 " + styles.thead } style={{ fontSize: "12px" }}>
              <div style={{ flex: "1.5", maxWidth: "80px" }} className={ styles.thead_photo_cover }></div>
              <div style={{ flex: "5" }} className={ styles.thead_title }>標題</div>
              <div style={{ flex: "3" }} className={ styles.thead_theme }>分類</div>
              <div style={{ flex: "1", textAlign: "center" }}>讚</div>
              <div style={{ flex: "1", textAlign: "center" }}>回文</div>
              <div style={{ flex: "2", textAlign: "center" }}>發文日期</div>
              <div style={{ flex: "2", textAlign: "center" }}>回文日期</div>
              <div style={{ width: "32px" }}></div>
            </div>
            { render_list }
            <div className="rows_btn_type1">
              { render_page }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    member: state.member
    // article: state.article
  }
}

export default connect(mapStateToProps)(MemberInfo)
