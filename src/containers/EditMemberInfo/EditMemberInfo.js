import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import styles from './EditMemberInfo.css'

import Loader from '../../components/Loader/Loader'
import IconTitle from '../../components/IconTitle/IconTitle'
import BtnBack from '../../components/Btns/BtnBack'
import EditName from '../../components/EditMemberInfo/EditName'
import EditPassword from '../../components/EditMemberInfo/EditPassword'
import EditCompanyName from '../../components/EditMemberInfo/EditCompanyName'
import EditJobTitle from '../../components/EditMemberInfo/EditJobTitle'
import EditProPic from '../../components/EditMemberInfo/EditProPic'

import { apiGetArticleContent, apiUpdateArticleContent, apiUploadArticleImg } from '../../actions/article'
import { isEmpty, isValidSize, isPhotoType, combineContentValue, yyyymmdd } from '../../utils'
const constants = require('../../constants')

class EditMemberInfo extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state ={
      member: null,
      loading: true
    }
  }

  componentDidMount () {

    let member_cookie = window.sessionStorage.getItem('cookie')
    let auth_token = window.sessionStorage.getItem('token')

    // 檢查是否登入會員 
    if ( member_cookie == undefined || auth_token == undefined ) {

      alert('請先登入會員')
      window.location.href = '/member_login'
    }
  }

  componentDidUpdate () { 

    if( !isEmpty(this.props.member) && this.state.loading == true ) {

      this.setState({ loading: false })
    }
  }

  renderEmail () {

    const { member } = this.props

    return (
      <div className={ styles.row }>
        <div>電子郵件</div>
        <div>{ member.member_info.email }</div>
        <div></div>
      </div>
    )
  }

  renderRegisterTime () {

    const { member } = this.props

    return (
      <div className={ styles.row }>
        <div>註冊日期</div>
        <div>{ yyyymmdd( member.member_info.register_time ) }</div>
        <div></div>
      </div>
    )
  }

  render () {
    // console.log( this.props );
    const { loading } = this.state

    let render_pro_pic = <Loader />
    let render_name = <Loader />
    let render_password = <Loader />
    let render_company_name = <Loader />
    let render_job_title = <Loader />
    let render_email = <Loader />
    let render_register_time = <Loader />

    const { member } = this.props 
    // console.log(member)
    if( loading == false ) {

      render_pro_pic = <EditProPic member={ member.member_info } />
      render_name = <EditName member={ member.member_info } />
      render_password = <EditPassword member={ member.member_info } />
      render_company_name = <EditCompanyName member={ member.member_info } />
      render_job_title = <EditJobTitle member={ member.member_info } />
      render_email = this.renderEmail()
      render_register_time = this.renderRegisterTime()
    }

    return (
      <div className={ styles.edit_member }>
        <div>
          <IconTitle title="首頁 > 會員資訊" color="#9e9e9e" />
        </div>
        <div className={ styles.form }>
          <div className="bg_type1">
            <div className="border_type1">
              <div className={ styles.row + " " + styles.topic }>
                <BtnBack color="black" />
                <div>會員資訊</div>
                <div></div>
              </div>
              { render_pro_pic }
              { render_name }
              { render_password }
              { render_company_name }
              { render_job_title }
              { render_email }
              { render_register_time }
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

export default connect(mapStateToProps)(EditMemberInfo)
