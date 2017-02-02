import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { apiGetArticle, apiLikeArticle, apiDislikeArticle, apiCollectArticle, apiDeleteCollectArticle } from '../../actions/article'
// import { apiGetNews } from '../../actions/news'
import styles from './ArticleDetail.css'
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

class ArticleDetail extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { is_like: 0, is_collect: 0, enable: 1, likes: 0, loading: 1 }
  }

  componentWillReceiveProps (nextProps) {

    if( nextProps.article != this.props.article && this.state.loading == 1 ) {

      if( !isEmpty(nextProps.article.article_info.content) ) {

        this.setState({ 
          loading: 0, 
          is_like: nextProps.article.article_info.content[0].liked,  
          likes: nextProps.article.article_info.content[0].like_count, 
          is_collect: nextProps.article.article_info.collected
        })
      }
    }

    //
    if ( nextProps.article.api_status == 0 ) {
      alert ( nextProps.article.error_msg )
      window.location.href = '/'
    }
  }

  componentDidMount () {

    let member_cookie = window.sessionStorage.getItem("cookie") || ''
    let auth_token = window.sessionStorage.getItem("token") || ''

    if ( this.props.route.type == "theme" ) {
      this.props.dispatch( apiGetArticle( location.origin, this.props.params.article_id, member_cookie, auth_token ) )
    }
    // else if ( this.props.route.type == "news" ) {
    //   this.props.dispatch( apiGetNews( location.origin, this.props.params.news_id, member_cookie, auth_token ) )
    // }
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

  renderTitle ( article_info ) {

    return (
      <div className={ styles.title }>
        <a href="/"><IconTitle title="首頁" color="#000" /></a>
        <div style={{ margin: "0 4px" }}> > </div>
        <div className={ styles.link } onClick={ ()=> window.location.href="/theme/" + article_info.mainboard_id }>{ article_info.mainboard_name }</div>
        <div style={{ margin: "0 4px" }}> > </div>
        <div className={ styles.link } onClick={ ()=> window.location.href="/theme/" + article_info.mainboard_id + "/" + article_info.subboard_id }>{ article_info.subboard_name }</div>
      </div>
    )
  }

  renderArticle( article, member ) {
    let render = <Loader />
    
    if ( article.article_info != undefined ) {
      // console.log(article.article_info)
      let article_info = article.article_info
      let article_content = constants.VIEW_TEXT_ARTICLE_1
      let article_replys = 0
      let render_btn_reply = null
      let render_article_reply = null
      let article_id = article_info.article_id
      let article_content_id = 0

      let likes = this.state.likes
      let is_like_css =  this.state.is_like == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action
      let is_collect_css =  this.state.is_collect == 1 ? styles.btn_action + ' ' + styles.active : styles.btn_action
      let render_btn = <div onClick={()=>this.clickCollect(member, article_id)} className={is_collect_css}>收藏</div>

      if ( !isEmpty(article_info.content) ) {
        // console.log(article_info.content)
        article_content = article_info.content[0].content
        article_content_id = article_info.content[0].article_content_id
        article_replys = (article_info.content.length-1)
        render_article_reply = this.renderArticleReply( article_info.content, member )

        if( !isEmpty(member.member_info) )
          if( member.member_info.id == article_info.content[0].user_id )
            render_btn = <div className={ styles.btn_action } onClick={ ()=> window.location.href='/article/edit/'+article_content_id }>編輯</div>
      }

      render =  <div className={styles.news_article_bg}>
                  <div>
                    <div className="flex flex_jc_sb flex_ai_c" style={{"paddingBottom": "10px"}}>
                      <div className={styles.news_title}>{ article_info.title }</div>
                      <div className={styles.post_date}>文章發布日期 : { yyyymmdd( article_info.post_time ) }</div>
                    </div>
                    <div className={styles.news_img}><img src="http://placehold.it/600x340" /></div>
                    <div className={styles.news_content}>{ ReactHtmlParser( article_content ) }</div>
                    <LikesTip likes={likes} msgs={ article_replys } />
                    <div className={styles.actions} className="flex">
                      <div onClick={()=>this.clickLike(member, article_content_id)} className={is_like_css}>讚</div>
                      { render_btn }
                      <Link to={"/reply_article/"+article_id} style={{"width": "100%"}}><BtnAction text="回覆" /></Link>
                    </div>
                  </div>
                  { render_article_reply }
                </div>
    } 
    return render
  }

  renderArticleReply ( content, member ) {

    return  content.map((x, y)=>{
              if(y != 0)
               return <ArticleReply key={"reply_"+y} {...x} dispatch={this.props.dispatch} member={member} />
            })
  }

  renderAuthorInfo ( article, member ) {

    let render = <Loader />

    if( !isEmpty( article ) ) {
      // console.log(article)
      let author_info = article.article_info.content[0]
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

  renderMobileAuthorInfo ( article, member ) {

    let render = <Loader />

    if( !isEmpty( article ) ) {

      let author_info = article.article_info.content[0]
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
    const { article, news, member } = this.props

    let render_title = <Loader />
    let render_mobile_author_info = null
    let render_author_info = null
    let render_article = <div style={{ padding: "20px", backgroundColor: "#fff" }}>{ constants.VIEW_TEXT_ARTICLE_1 }</div>
    
    if( !isEmpty(article.article_info) ) {
      render_title = this.renderTitle( article.article_info )
      
      if ( !isEmpty(article.article_info.content) ) {
        render_mobile_author_info = this.renderMobileAuthorInfo( article, member )
        render_article = this.renderArticle( article, member )
        render_author_info = this.renderAuthorInfo( article, member )
      }
    }

    return (
      <div className={styles.news_detail}>
        <div className={styles.breadcrumb}>
          { render_title }
        </div>
        <div className={styles.bg}>
          <div className={styles.news_article}>
            { render_mobile_author_info }
            { render_article }
          </div>
          <div className={styles.news_author}>
            { render_author_info }
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
    article: state.article,
    news: state.news
  }
}

export default connect(mapStateToProps)(ArticleDetail)
