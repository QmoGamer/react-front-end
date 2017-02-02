import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import styles from './MyPostArticle.css'
import { apiDeleteArticle } from '../../actions/article'
import { apiGetMyPost } from '../../actions/member'
import { isEmpty, yyyymmdd } from '../../utils'
import Loader from '../../components/Loader/Loader'
const constants = require('../../constants');

import IconTitle from '../../components/IconTitle/IconTitle'
import BtnPage from '../../components/BtnPage/BtnPage'

class MyPostArticle extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { loading: 1 }
  }

  componentDidMount () {

    if ( window.sessionStorage.getItem("cookie") && window.sessionStorage.getItem("token") && window.sessionStorage.getItem("id") ) {
      let page = this.props.params.page
      let member_cookie = window.sessionStorage.getItem("cookie")
      let auth_token = window.sessionStorage.getItem("token")
      let user_id = window.sessionStorage.getItem("id")
      this.props.dispatch( apiGetMyPost( location.origin, member_cookie, auth_token, user_id, page ) )
    }
    else {
      alert("請先登入會員")
      window.location.href = '/'
    }
  }

  componentWillReceiveProps (nextProps) {

    if( !isEmpty( nextProps.article.delete_article_status ) ) {
      if( nextProps.article.delete_article_status.api_status == 0 ) {
        alert(nextProps.article.delete_article_status.error_msg);
      }
      window.location.reload()
    }

    // console.log("will");
    if( nextProps.params.page != this.props.params.page ) {
      this.setState({ loading: 1 })
      let member = this.props.member
      if ( member.member_status == 2 ) {
        let page = nextProps.params.page
        this.props.dispatch( apiGetMyPost( location.origin, member.member_info.member_cookie, member.member_info.token, member.member_info.id, page ) )
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("did");
    let member = this.props.member
    if ( isEmpty(member.my_post) && member.member_status == 2 ) {
       this.props.dispatch( apiGetMyPost( location.origin, member.member_info.member_cookie, member.member_info.token, member.member_info.id, this.props.params.page ) )
    }

    if ( prevProps.member.my_post != this.props.member.my_post && this.state.loading == 1 ) {
      this.setState({ loading: 0 })
    }
  }

  toggleEdit ( bool, y, type ) {

    if ( bool == true && type == 'desktop' ) {
      this.refs['desktop_edit_'+y].style.display = "block"
      this.refs['desktop_mask_'+y].style.display = "block"
      this.refs['desktop_icon_'+y].style.backgroundColor = "red"
      this.refs['desktop_icon_'+y].className += " active"
    }
    else if ( bool == true && type == 'mobile' ) {
      this.refs['mobile_edit_'+y].style.display = "block"
      this.refs['mobile_mask_'+y].style.display = "block"
      this.refs['mobile_icon_'+y].style.backgroundColor = "red"
      this.refs['mobile_icon_'+y].className += " active"
    }
    else if ( bool == false && type == 'desktop' ) {
      this.refs['desktop_edit_'+y].style.display = "none"
      this.refs['desktop_mask_'+y].style.display = "none"
      this.refs['desktop_icon_'+y].style.backgroundColor = "#eee"
      this.refs['desktop_icon_'+y].className = "rows_edit_img"
    }
    else if ( bool == false && type == 'mobile' ) {
      this.refs['mobile_edit_'+y].style.display = "none"
      this.refs['mobile_mask_'+y].style.display = "none"
      this.refs['mobile_icon_'+y].style.backgroundColor = "#eee"
      this.refs['mobile_icon_'+y].className = "rows_edit_img"
    }
  }

  renderMyArticleList ( my_post ) {

    let render = <Loader />

    if( my_post != undefined && this.state.loading == 0 ) {
      // console.log(my_post);
      if ( my_post.page_content.length != 0 ) {

        render = my_post.page_content.map((x, y)=>{

          let article_id = x.article_id

          if( x.content.length == 0 ) {

            return (
              <div key={"no_content_"+y} className="rows_type1 flex_ai_c">
                <div style={{ flex: "1" }}>{ constants.VIEW_TEXT_ARTICLE_1 }</div>
                <div ref={"desktop_icon_"+y} className="rows_edit_img" onClick={()=>this.toggleEdit(true, y, 'desktop')}>
                  <div ref={"desktop_edit_"+y} className="rows_edit">
                    <div onClick={()=>this.deletePost(article_id)}>刪除</div>
                  </div>
                </div>
                <div ref={"desktop_mask_"+y} className="mask" onClick={()=>this.toggleEdit(false, y, 'desktop')}></div>
              </div>
            )
          }
          else {

            let title = x.title
            let mainboard_id = x.mainboard_id
            let mainboard_name = x.mainboard_name
            let subboard_id = x.subboard_id
            let subboard_name = x.subboard_name
            let article_content_id = x.content[0].article_content_id
            let like_count = x.content[0].like_count
            let reply_count = x.response_count > 0 ? x.response_count : 0
            let post_date = yyyymmdd(x.post_time)

            return ( 
              <div key={"my_post_"+y} className="rows_type1">
                <div className={styles.desktop}>
                  <div></div>
                  <Link to={"/theme_detail/"+article_id} style={{flex: 4, paddingRight: "10px"}} className={"ellipsis "+styles.title}>{title}</Link>
                  <div style={{flex: 3, color: "#0af", display: 'none'}}>
                    <Link to={"/theme/"+mainboard_id}>{mainboard_name}</Link>
                    >
                    <Link to={"/theme/"+mainboard_id+"/"+subboard_id}>{subboard_name}</Link>
                  </div>
                  <div style={{flex: 1}}>{like_count}</div>
                  <div style={{flex: 1}}>{reply_count}</div>
                  <div style={{flex: 2}}>{post_date}</div>
                  <div ref={"desktop_icon_"+y} className="rows_edit_img" onClick={()=>this.toggleEdit(true, y, 'desktop')}>
                    <div ref={"desktop_edit_"+y} className={"rows_edit " + styles.rows_edit}>
                      <div onClick={()=>window.location.href="/article/edit/"+article_content_id}>編輯</div>
                      <div onClick={()=>this.deletePost(article_id)}>刪除</div>
                    </div>
                  </div>
                  <div ref={"desktop_mask_"+y} className="mask" onClick={()=>this.toggleEdit(false, y, 'desktop')}></div>
                </div>
                <div className={styles.mobile}>
                  <div>{post_date}</div>
                  <div className="flex flex_ai_c flex_jc_sb">
                    <div>
                      <Link to={"/theme_detail/"+article_id} className={"ellipsis "+styles.title} style={{paddingRight: "10px"}}>{title}</Link>
                      <div style={{color: "#0af", display: "none"}}>
                        <Link to={"/theme/"+mainboard_id}>{mainboard_name}</Link>
                        >
                        <Link to={"/theme/"+mainboard_id+"/"+subboard_id}>{subboard_name}</Link>
                      </div>
                      <div className="flex">
                        <div style={{marginRight: "10px"}}>{like_count}讚</div>
                        <div>{reply_count}回文</div>
                      </div>
                    </div>
                    <div>
                      <div ref={"mobile_icon_"+y} className="rows_edit_img" onClick={()=>this.toggleEdit(true, y, 'mobile')}>
                        <div ref={"mobile_edit_"+y} className="rows_edit">
                          <div onClick={()=>window.location.href="/article/edit/"+article_content_id}>編輯</div>
                          <div onClick={()=>this.deletePost(article_id)}>刪除</div>
                        </div>
                      </div>
                      <div ref={"mobile_mask_"+y} className="mask" onClick={()=>this.toggleEdit(false, y, 'mobile')}></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        })
      }
      else {
        render = <div className="rows_type1">{ constants.VIEW_TEXT_MY_POST_1 }</div>
      }
    }

    return render
  }

  renderPaging ( my_post ) {
    let render = <Loader />

    if ( my_post != undefined )
      render = <BtnPage page={parseInt(my_post.page)} total_page={parseInt(my_post.total_page)} path="/my/post" />

    return render
  }

  deletePost ( id ) {

    if(confirm("確定刪除嗎")){

      let member = this.props.member

      if( member.member_status == 2 ) {
        // console.log(member.member_info);
        this.props.dispatch( apiDeleteArticle( location.origin, id, member.member_info.member_cookie, member.member_info.token ) )
      }
      else {
        alert('請先登入會員')
        window.location.href='/member_login'
      }
    }
  }

  render() {
    console.log(this.props);
    const { member } = this.props
    // console.log(member.my_collect);
    let nickname = null
    if( !isEmpty(member.member_info) ) {
      nickname = member.member_info.nickname
    }

    return (
      <div className="padding_type1">
        <div className="breadcrumb">
          <IconTitle icon_classname="fa fa-home" title="我的 > 我的發文" color="#000" />
        </div>
        <div>
          <div className="bg_type1">
            <div className="border_type1">
              <div className={styles.rows_type2}>
                {nickname}發表過的文章
              </div>
              <div className={"rows_type1 " + styles.header }>
                <div></div>
                <div style={{flex: 4, paddingRight: "10px"}}>標題</div>
                <div style={{flex: 3, display: "none"}}>分類</div>
                <div style={{flex: 1}}>讚</div>
                <div style={{flex: 1}}>回文</div>
                <div style={{flex: 2}}>發文日期</div>
                <div style={{width: "32px"}}></div>
              </div>
              { this.renderMyArticleList( member.my_post ) }
              { this.renderPaging( member.my_post ) }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state)
  return { 
    member: state.member,
    article: state.article
  }
}

export default connect(mapStateToProps)(MyPostArticle)