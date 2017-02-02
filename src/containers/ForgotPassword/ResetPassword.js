import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './ResetPassword.css'

import Loader from '../../components/Loader/Loader'
import IconTitle from '../../components/IconTitle/IconTitle'

import { apiResetPassword } from '../../actions/member'
import { isEmail, isPassword } from '../../utils'
const constants = require('../../constants')

class ResetPassword extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    // console.log(this.props)
    let email = this.refs.email.value
    let token = this.props.params.token
    let new_password = this.refs.new_password.value
    let confirm_password = this.refs.confirm_password.value
    // console.log(email, token, new_password, confirm_password)
    if( !isEmail( email ) ) {
      alert('電子郵件格式不符')
    }
    else if( !isPassword( new_password ) ) {
      alert("用戶密碼格式不符")
    }
    else if( confirm_password != new_password ) {
      alert("密碼不一致")
    }
    else {

      this.props.dispatch( apiResetPassword( location.origin, email, token, new_password, confirm_password ) )
        .then( res => {

          if( res.data.status == 1 ) {

            this.refs.box_1.style.display = 'none'
            this.refs.box_2.style.display = 'block'  
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  render() {
    // console.log(this.props);

    return (
      <div className={ styles.reset_password }>
        <div className="breadcrumb">
          <IconTitle icon_classname="fa fa-home" title="會員 > 重設密碼" color="#000" />
        </div>
        <div className="bg_type1">
          <div className="border_type1">
            <div ref="box_1" className={ styles.box_1 }>
              <div className={ styles.topic }>重設新密碼</div>
              <div className={ styles.hr } style={{ marginTop: "0" }}></div>
              <div className={ styles.field }>
                <div>
                  <label style={{ left: '-56px' }}>電子郵件: </label>
                  <input ref="email" />
                </div>
              </div>
              <div className={ styles.warning }>*請填寫您申請帳號時所用的電子郵件</div>
              <div className={ styles.hr }></div>
              <div className={ styles.field }>
                <div>
                  <label style={{ left: '-42px' }}>新密碼: </label>
                  <input ref="new_password" type="password" />
                </div>
              </div>
              <div className={ styles.warning }>*{ constants.VIEW_TEXT_MEMBER_1 }</div>
              <div className={ styles.hr }></div>
              <div className={ styles.field }>
                <div>
                  <label style={{ left: '-70px' }}>確認新密碼: </label>
                  <input ref="confirm_password" type="password" />
                </div>
              </div>
              <div className={ styles.warning }>*請再次輸入密碼</div>
              <div className={ styles.hr }></div>
              <div className={ styles.btn }>
                <div className="btn_action_red" onClick={ this.onSubmit }>開始重設</div>
              </div>
            </div>
            <div ref="box_2" className={ styles.box_2 }>
              <div className={ styles.topic }>重設新密碼成功</div>
              <div className={ styles.msg }>請使用新密碼登入</div>
              <div className={ styles.btn }>
                <div className="btn_action_red" onClick={ ()=> window.location.href = "/member_login" }>會員登入</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(ResetPassword)