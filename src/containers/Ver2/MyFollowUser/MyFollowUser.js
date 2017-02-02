import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Loader from '../../../components/Loader/Loader'
import IconTitle from '../../../components/IconTitle/IconTitle'
import BtnPage from '../../../components/BtnPage/BtnPage'
// import MyFollowRow from './MyFollowRow'
import ThemeArticleList from '../../../components/Ver2/ThemeArticleList/ThemeArticleList'

import styles from './MyFollowUser.css'
import { ver2_apiGetMyFollow } from '../../../actions/member'
import { isEmpty, yyyymmdd, arrayPaging } from '../../../utils'
const constants = require('../../../constants');

class MyFollowUser extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      data: [], 
      loading: true
    }
  }

  componentDidMount () {

    const { page } = this.props.params
    const member_cookie = window.sessionStorage.getItem("cookie")
    const auth_token = window.sessionStorage.getItem("token")

    if ( member_cookie && auth_token ) {
      
      this.props.dispatch( ver2_apiGetMyFollow( location.origin, member_cookie, auth_token, page ) )
        .then( res => res.data.status == 1 ? this.setState({ data: res.data.result }) : alert( res.data.error.error_msg ) )
    }
    else {

      alert("請先登入會員")
      window.location.href = '/'
    }
  }

  componentDidUpdate () {

    const { data, loading } = this.state

    if( !isEmpty( data ) && loading == true ) {
      this.setState({ loading: false })
    }
  }

  renderList () {

    const { data } = this.state
    const { member } = this.props

    // console.log( data )
    // 錯誤檢查 etc, page大於total_page
    if( data.page_content == undefined ) {
      window.location.href = "/"
    }
    else if ( data.page_content.length == 0 )
      return <div>{ constants.VIEW_TEXT_ARTICLE_2 }</div>
    else
      return <ThemeArticleList data={ data.page_content } member={ member } />
  }

  renderPage () {

    const { data } = this.state
    const array = arrayPaging( data.page, data.total_page )

    let render = array.map((x, y)=>{
      let css = x == data.page ? "active" : null
      return <div key={ 'page' + y } onClick={ ()=> window.location.href = "/my/follow/" + x } className={ "btn_page " + css }>{x}</div>
    })

    return <div className="rows_btn_type1">{render}</div>
  }

  render() {

    const { loading } = this.state
    let render_list = <Loader />
    let render_page = <Loader />

    if ( loading == false ) {
      render_list = this.renderList()
      render_page = this.renderPage()
    }

    return (
      <div className={ styles.my_follow }>
        <div className="breadcrumb">
          <IconTitle icon_classname="fa fa-home" title="我的 > 追蹤訂閱" color="#000" />
        </div>
        <div>
          <div className="bg_type1">
            <div className="border_type1">
              { render_list }
              { render_page }
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
    member: state.member
  }
}

export default connect(mapStateToProps)(MyFollowUser)