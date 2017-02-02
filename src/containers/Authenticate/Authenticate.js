import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './Authenticate.css'

import Loader from '../../components/Loader/Loader'
import IconTitle from '../../components/IconTitle/IconTitle'

import { apiAuthenticateEmail } from '../../actions/member'
import { isEmail } from '../../utils'

class Authenticate extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
  }

  componentDidMount() {

    let email = this.props.params.email
    let token = this.props.params.token

    this.props.dispatch( apiAuthenticateEmail( location.origin, email, token ) )
      .then( res => {

        if( res.data.status == 1 ) {

          this.refs.box_1.style.display = 'block'
        }
        else {

          this.refs.box_2.style.display = 'block'
          console.log( res.data.error.error_msg )
        }
      })
  }

  render() {
    // console.log(this.props);

    return (
      <div className={ styles.authenticate }>
        <div className="breadcrumb">
          <IconTitle icon_classname="fa fa-home" title="會員 > 驗證會員" color="#000" />
        </div>
        <div className="bg_type1">
          <div className="border_type1">
            <div ref="box_1" className={ styles.box_1 }>
              <div className={ styles.topic }>驗證成功</div>
              <div className={ styles.msg }>您的帳號已經啟用, 請點選下面按鈕前往登入</div>
              <div className={ styles.btn }>
                <div className="btn_action_red" onClick={ ()=> window.location.href = "/member_login" }>會員登入</div>
              </div>
            </div>
            <div ref="box_2" className={ styles.box_2 }>
              <div className={ styles.topic }>驗證失敗</div>
              <div className={ styles.msg }>驗證已失敗，請聯絡管理員。</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Authenticate)
