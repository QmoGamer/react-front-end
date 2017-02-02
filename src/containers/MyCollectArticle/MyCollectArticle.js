import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import styles from './MyCollectArticle.css'
import { apiGetMyCollect } from '../../actions/member'
import { apiDeleteCollectArticle } from '../../actions/article'
import { isEmpty, yyyymmdd } from '../../utils'
import Loader from '../../components/Loader/Loader'
const constants = require('../../constants');

import IconTitle from '../../components/IconTitle/IconTitle'
import BtnPage from '../../components/BtnPage/BtnPage'

class MyCollectArticle extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { loading: 1 }
  }

  componentDidMount () {

    if ( window.sessionStorage.getItem("cookie") && window.sessionStorage.getItem("token") ) {
      let page = this.props.params.page
      let member_cookie = window.sessionStorage.getItem("cookie")
      let auth_token = window.sessionStorage.getItem("token")
      this.props.dispatch( apiGetMyCollect( location.origin, member_cookie, auth_token, page ) )
    }
    else {
      alert("請先登入會員")
      window.location.href = '/'
    }
  }

  componentWillReceiveProps (nextProps) {

    // console.log(nextProps);
    if( !isEmpty( nextProps.article.collect_article_status ) ) {
      if( nextProps.article.collect_article_status.api_status == 0 ) {
        alert(nextProps.article.collect_article_status.error_msg);  
      }
      if( nextProps.article.collect_article_status.type == 2 ) {
        window.location.reload()
      }
    }

    // console.log("will");
    if( nextProps.params.page != this.props.params.page ) {
      this.setState({ loading: 1 })
      let member = this.props.member
      if ( member.member_status == 2 ) {
        let page = nextProps.params.page
        this.props.dispatch( apiGetMyCollect( location.origin, member.member_info.member_cookie, member.member_info.token, page ) )
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("did");
    let member = this.props.member
    if ( isEmpty(member.my_collect) && member.member_status == 2 ) {
      this.props.dispatch( apiGetMyCollect( location.origin, member.member_info.member_cookie, member.member_info.token, this.props.params.page ) )
    }

    if ( prevProps.member.my_collect != this.props.member.my_collect && this.state.loading == 1 ) {
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

  deleteCollect ( id ) {

    if(confirm("確定取消收藏嗎")){

      let member = this.props.member

      if( member.member_status == 2 ) {
        // console.log(member.member_info);
        this.props.dispatch( apiDeleteCollectArticle( location.origin, member.member_info.member_cookie, member.member_info.token, id ) )
      }
      else {
        alert('請先登入會員')
        window.location.href='/member_login'
      }
    }
  }

  renderMyCollectList ( my_collect ) {

    let render = <Loader />
    // console.log(my_collect);
    if( my_collect != undefined ) {
      // console.log(my_collect);
      if ( my_collect.page_content.length != 0 )
        render = my_collect.page_content.map((x, y)=>{
          return ( 
            <div key={"my_post_"+y} className="rows_type1">
              <div className={styles.desktop}>
                <div style={{flex: 2}}>{yyyymmdd(x.post_time)}</div>
                <Link style={{flex: 10, paddingRight: "10px"}} to={"/theme_detail/"+x.id} className={"ellipsis "+styles.title}>{x.title}</Link>
                <div ref={"desktop_icon_"+y} className="rows_edit_img" onClick={()=>this.toggleEdit(true, y, 'desktop')}>
                  <div ref={"desktop_edit_"+y} className="rows_edit" onClick={()=>this.deleteCollect(x.id)}>取消收藏</div>
                </div>
                <div ref={"desktop_mask_"+y} className="mask" onClick={()=>this.toggleEdit(false, y, 'desktop')}></div>
              </div>
              <div className={styles.mobile}>
                <div>
                  <div>{yyyymmdd(x.post_time)}</div>
                  <Link to={"/theme_detail/"+x.id} className={"ellipsis "+styles.title}>{x.title}</Link>
                </div>
                <div ref={"mobile_icon_"+y} className="rows_edit_img" style={{marginLeft: "auto"}} onClick={()=>this.toggleEdit(true, y, 'mobile')}>
                  <div ref={"mobile_edit_"+y} className="rows_edit" onClick={()=>this.deleteCollect(x.id)}>取消收藏</div>
                </div>
                <div ref={"mobile_mask_"+y} className="mask" onClick={()=>this.toggleEdit(false, y, 'mobile')}></div>
              </div>
            </div>
          )
      })
      else {
        render = <div className={ styles.rows }>{ constants.VIEW_TEXT_MY_COLLECT_1 }</div>
      }
    }

    return render
  }

  renderPaging ( my_collect ) {

    let render = <Loader />

    if ( my_collect != undefined )
      render = <BtnPage page={parseInt(my_collect.page)} total_page={parseInt(my_collect.total_page)} list_type="/my/collect" />

    return render
  }

  render() {
    // console.log(this.props);
    const { member } = this.props
    // console.log(member.my_collect);

    return (
      <div className="padding_type1">
        <div className="breadcrumb">
          <IconTitle icon_classname="fa fa-home" title="我的 > 收藏文章" color="#000" />
        </div>
        <div>
          <div className="bg_type1">
            <div className="border_type1">
              <div className={"rows_type1 " + styles.header }>
                <div style={{flex: 2}}>收藏日期</div>
                <div style={{flex: 10}}>標題</div>
                <div style={{width: "30px"}}></div>
              </div>
              { 
                this.renderMyCollectList( member.my_collect ) 
              }
              <div className="rows_btn_type1">
                { 
                  this.renderPaging( member.my_collect ) 
                }
              </div>
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

export default connect(mapStateToProps)(MyCollectArticle)