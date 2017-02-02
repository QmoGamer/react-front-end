import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { apiGetNews, apiLikeNews, apiDislikeNews, apiCollectNews, apiDeleteCollectNews } from '../../actions/news'
import styles from './NewsDetail.css'
import { isEmpty, DatetimeToMsgTime, yyyymmdd, checkImg } from '../../utils'
import Loader from '../../components/Loader/Loader'
import ReactHtmlParser from 'react-html-parser'
const constants = require('../../constants')

import BtnAction from '../../components/BtnAction/BtnAction'
import MsgArea from '../../components/MsgArea/MsgArea'
import IconTitle from '../../components/IconTitle/IconTitle'
import LikesTip from '../../components/LikesTip/LikesTip'
import AuthorInfo from '../../components/AuthorInfo/AuthorInfo'
import MobileAuthorInfo from '../../components/MobileAuthorInfo/MobileAuthorInfo'
import ArticleReply from '../../components/ArticleReply/ArticleReply'

class NewsDetail extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { is_like: 0, is_collect: 0, enable: 1, likes: 0, loading: 1 }
  }

  componentWillReceiveProps (nextProps) {

  }

  componentDidUpdate (prevProps, prevState) {

    if(prevProps.news.news_detail != this.props.news.news_detail) {
      let news_detail = this.props.news.news_detail[0]
      this.setState({ 
        loading: 0, 
        is_like: news_detail.liked,  
        likes: news_detail.like_count, 
        is_collect: news_detail.collected
      })
    }
  }

  componentDidMount () {

    let member_cookie = window.sessionStorage.getItem("cookie") || ''
    let auth_token = window.sessionStorage.getItem("token") || ''

    this.props.dispatch( apiGetNews( location.origin, this.props.params.news_id, member_cookie, auth_token ) )
  }

  clickLike ( member, news_id ) {

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
        this.props.dispatch( apiLikeNews(location.origin, member_cookie, auth_token, news_id) )
        this.setState({ is_like: 1, enable: 0, likes: (likes + 1) })
      }
      else {
        this.props.dispatch( apiDislikeNews(location.origin, member_cookie, auth_token, news_id) )
        this.setState({ is_like: 0, enable: 0, likes: (likes - 1) })
      }

      setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 1000)
    }
  }

  clickCollect ( member, news_id ) {

    if(this.state.enable == 1) {

      if( member.member_status != 2 ) {
        alert("請先登入會員")
        window.location.href = '/member_login'
      }

      let member_cookie = member.member_info.member_cookie
      let auth_token = member.member_info.token
      let is_collect = this.state.is_collect

      if( is_collect != 1 ) {
        this.props.dispatch( apiCollectNews(location.origin, member_cookie, auth_token, news_id) )
        this.setState({ is_collect: 1, enable: 0 })
      }
      else {
        this.props.dispatch( apiDeleteCollectNews(location.origin, member_cookie, auth_token, news_id) )
        this.setState({ is_collect: 0, enable: 0 })
      }

      setTimeout(function(){this.setState({ enable: 1 })}.bind(this), 1000)
    }
  }

  renderNews( news, member ) {
    let render = <Loader />

    if( news.news_detail != undefined ) {
      // console.log(news.news_detail);
      let news_detail = news.news_detail[0]
      let btn_action = null

      if( news_detail.type == "新聞" ) {

        let is_like_css =  this.state.is_like == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action
        let is_collect_css =  this.state.is_collect == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action

        btn_action =  <div className={styles.actions} className="flex">
                        <div onClick={()=>this.clickLike(member, news_detail.news_id)} className={is_like_css}>讚</div>
                        <div onClick={()=>this.clickCollect(member, news_detail.news_id)} className={is_collect_css}>收藏</div>
                      </div>
      }

      render =  <div className={styles.news_article_bg}>
                  <div>
                    <div className="flex flex_jc_sb flex_ai_c" style={{"paddingBottom": "10px"}}>
                      <div className={styles.news_title}>{ news_detail.title }</div>
                      <div className={styles.post_date}>文章發布日期 : { yyyymmdd( news_detail.post_time ) }</div>
                    </div>
                    <div className={styles.news_img}><img src="http://placehold.it/600x340" /></div>
                    <div className={styles.news_content}>{ ReactHtmlParser( news_detail.content ) }</div>
                    { btn_action }
                  </div>
                </div>
    }
    return render
  }

  renderAuthorInfo ( news, member ) {

    let render = <Loader />

    if( !isEmpty( news ) ) {
      // console.log(news);
      let author_info = news.news_detail[0]
      let author = {
        pro_pic: checkImg( author_info.userImage ),
        name: author_info.nickname, 
        articles: author_info.user_article_count, 
        follows: author_info.user_follow_count, 
        user_id: author_info.user_id,
        is_follow: author_info.followed,
        member: member,
        dispatch: this.props.dispatch
      }

      render = <AuthorInfo {...author} />
    }

    return render
  }

  renderMobileAuthorInfo ( news, member ) {

    let render = <Loader />

    if( !isEmpty( news ) ) {
      // console.log(news);
      let author_info = news.news_detail[0]
      let author = {
        pro_pic: checkImg( author_info.userImage ),
        name: author_info.nickname, 
        articles: author_info.user_article_count, 
        follows: author_info.user_follow_count, 
        user_id: author_info.user_id,
        is_follow: author_info.followed,
        member: member,
        dispatch: this.props.dispatch
      }

      render = <MobileAuthorInfo {...author} />
    }

    return render
  }

  render () {
    // console.log(this.props);
    const { news, member } = this.props

    let render_title = <Loader />
    if( !isEmpty(news.news_detail) ) {
      render_title = <IconTitle icon_classname="fa fa-home" title={news.news_detail[0].type + " > " + news.news_detail[0].title} color="#444" />
    }

    return (
      <div className={styles.news_detail}>
        <div className={styles.breadcrumb}>
          { render_title }
        </div>
        <div className={styles.bg}>
          <div className={styles.news_article}>
            { 
              this.renderMobileAuthorInfo( news, member ) 
            }
            { this.renderNews( news, member ) }
          </div>
          <div className={styles.news_author}>
            { 
              this.renderAuthorInfo( news, member ) 
            }
            <div style={{"margin": "10px 0"}}>
              <img src="/public/ad/ad16.png" width="300px" height="100px" />
            </div>
            <div style={{"margin": "10px 0"}}>
              <img src="/public/ad/ad31.png" width="300px" height="300px" />
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
    member: state.member,
    news: state.news
  }
}

export default connect(mapStateToProps)(NewsDetail)
