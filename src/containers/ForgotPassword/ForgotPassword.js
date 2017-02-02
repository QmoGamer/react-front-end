import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './ForgotPassword.css'

import Loader from '../../components/Loader/Loader'
import IconTitle from '../../components/IconTitle/IconTitle'

import { apiForgotPassword } from '../../actions/member'
import { isEmail } from '../../utils'

class ForgotPassword extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    // this.state = ({ email: null })
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    // console.log(this.props)
    let email = this.refs.email.value

    if( !isEmail( email ) ) {
      alert('電子郵件格式不符')
    }
    else {
      
      this.props.dispatch( apiForgotPassword( location.origin, email ) )
        .then( res => {

          if( res.data.status == 1 ) {

            this.refs.box_1.style.display = 'none'
            this.refs.box_2.style.display = 'block'
            this.refs.msg_email.innerText = email
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  render() {
    // console.log(this.props);

    return (
      <div className={ styles.forgot_password }>
        <div className="breadcrumb">
          <IconTitle icon_classname="fa fa-home" title="會員 > 忘記密碼" />
        </div>
        <div className="bg_type1">
          <div className="border_type1">
            <div ref="box_1" className={ styles.box_1 }>
              <div className={ styles.topic }>忘記密碼</div>
              <div className={ styles.tip }>您若忘記登入密碼, 在此可以重新請求密碼重置。</div>
              <div className={ styles.hr }></div>
              <div className={ styles.email }>
                <div>
                  <label>電子郵件: </label>
                  <input ref="email" />
                </div>
              </div>
              <div className={ styles.warning }>*請填寫您申請帳號時所用的電子郵件</div>
              <div className={ styles.hr }></div>
              <div className={ styles.btn }>
                <div className="btn_action_red" onClick={ this.onSubmit }>開始重設</div>
              </div>
            </div>
            <div ref="box_2" className={ styles.box_2 }>
              <div className={ styles.topic }>訊息已送出</div>
              <div className={ styles.msg }>進一步指示的電子郵件已傳送至</div>
              <div className={ styles.msg_email } ref="msg_email"></div>
              <div className={ styles.btn }>
                <div className="btn_action_red" onClick={ ()=> window.location.href = "/" }>返回首頁</div>
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
    // member: state.member
  }
}

export default connect(mapStateToProps)(ForgotPassword)
