import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import styles from './MyFollowUser.css'
import { apiGetMyFollow } from '../../actions/member'
import { isEmpty, yyyymmdd } from '../../utils'
import Loader from '../../components/Loader/Loader'
const constants = require('../../constants');

import IconTitle from '../../components/IconTitle/IconTitle'
import BtnPage from '../../components/BtnPage/BtnPage'
import ThemePanel from '../../components/ThemePanel/ThemePanel'

class MyFollowUser extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { loading: 1 }
  }

  componentDidMount () {
    // console.log(this.props.member);
    if ( window.sessionStorage.getItem("cookie") && window.sessionStorage.getItem("token") ) {
      let page = this.props.params.page
      let member_cookie = window.sessionStorage.getItem("cookie")
      let auth_token = window.sessionStorage.getItem("token")
      this.props.dispatch( apiGetMyFollow( location.origin, member_cookie, auth_token, page ) )
    }
    else {
      alert("請先登入會員")
      window.location.href = '/'
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props.member);
    if( nextProps.params.page != this.props.params.page ) {
      this.setState({ loading: 1 })
      let member = this.props.member
      if ( member.member_status == 2 ) {
        let page = nextProps.params.page
        this.props.dispatch( apiGetMyFollow( location.origin, member.member_info.member_cookie, member.member_info.token, page ) )
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.props.member);
    let member = this.props.member
    if ( isEmpty(member.my_follow) && member.member_status == 2 ) {
       this.props.dispatch( apiGetMyFollow( location.origin, member.member_info.member_cookie, member.member_info.token, this.props.params.page ) )
    }

    if ( prevProps.member.my_follow != this.props.member.my_follow && this.state.loading == 1 ) {
      this.setState({ loading: 0 })
    }
  }

  renderMyFollow ( member ) {

    let render =  <Loader />
    if( member != undefined  && this.state.loading == 0 ) {
      if( !isEmpty(member.my_follow) && member.my_follow.length > 0 ) {
        console.log(member.my_follow);
        render =  <div className={styles.panels}>
                    {
                      member.my_follow.map((x, y)=><ThemePanel key={"theme_panel"+y} {...x} theme_id={x.mainboard_id} article_path="/theme_detail" member={member} dispatch={this.props.dispatch} />)
                    }
                  </div>
      }
      else {
        // console.log(theme_article.error.error_code);
        render = <div style={{textAlign: "center"}}>沒有文章...</div>
      }
    }
    return render
  }

  render() {
    console.log(this.props);
    const { member } = this.props

    return (

      <div className="padding_type1">
        <div className="breadcrumb">
          <div style={{marginLeft: "10px"}}>
            <IconTitle icon_classname="fa fa-home" title="我的 > 追蹤文章" color="#000" />
          </div>
        </div>
        { this.renderMyFollow( member ) }
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