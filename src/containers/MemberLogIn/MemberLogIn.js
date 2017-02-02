import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import styles from './MemberLogIn.css'
import { isEmpty, isEmail, isPassword, isChinese } from '../../utils'
import Loader from '../../components/Loader/Loader'
import { apiMemberRegister, apiMemberSignIn, clearMemberStatus } from '../../actions/member'
const constants = require('../../constants')

import IconTitle from '../../components/IconTitle/IconTitle'
import BtnTab from '../../components/BtnTab/BtnTab'

class MemberLogIn extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {

    this.setState({ "tab": this.props.route.tab })
  }

  changeTab (tab) {

    if(this.state.tab != tab) {
      if ( tab == "sign_in" ) {
        this.refs.name.value = ""
        this.refs.email.value = ""
      }
      else if ( tab == "register" ) {
        this.refs.email.value = ""
        this.refs.password.value = ""
      }
      this.setState({"tab": tab})
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log(nextProps);
    if( nextProps.route.tab != this.state.tab )
      this.changeTab( nextProps.route.tab )

    let member = nextProps.member
    // console.log(member);
    if( member.member_status != 0 ) {

      if ( member.member_info.api_status == 1 ) {

        if ( member.member_status == 2 ) {
          window.location.href = '/'
        }
        // else if ( member.member_status == 1 ) {
        //   alert("註冊成功, 我們已將驗證信寄送至您的信箱")
        //   window.location.href = '/'
        //   // this.props.router.push("/member_login")
        //   // this.changeTab("sign_in")
        //   // this.props.dispatch( clearMemberStatus() )
        // }
      }
      else if ( member.member_info.api_status == 0 ) {

        alert( member.member_info.error_msg )
        this.props.dispatch( clearMemberStatus() )
        // switch ( member.member_info.error_code ) {
        //   case 10000102:
        //     alert("密碼錯誤, 請重新輸入")
        //     break;
        //   case 10100204:
        //     alert("電子郵件已存在, 請重新輸入")
        //     break;
        //   default:
        //     alert( member.member_info.error_msg )
        //     break;
        // }
      }
    }
  }

  renderPage( tab ) {

    let render = <Loader />
    if ( tab == "sign_in" ) {
      render = this.renderSignIn()
    }
    else if ( tab == "register" ) {
      render = this.renderRegister()
    }
    return render
  }

  renderSignIn () {
    let render  = <div className={styles.sign_in}>
                    <div className={styles.top_tip}>
                      <div>請輸入您在本站註冊的電子郵件與密碼</div>
                    </div>
                    <div className={styles.email + " " + styles.custom_css}>
                      <div>
                        <label>電子郵件:</label>
                        <input ref="email" />
                        <div style={{"flex": "1"}}></div>
                      </div>
                    </div>
                    <div className={styles.password + " " + styles.custom_css}>
                      <div>
                        <label>用戶密碼:</label>
                        <input ref="password" type="password" />
                        <div style={{"flex": "1"}} className={styles.forgot_password}><a href="/forgot_password">忘記密碼</a></div>
                      </div>
                    </div>
                    <div className={styles.captcha}>
                      <label>驗證碼</label><img src="http://placehold.it/80x40" />
                    </div>
                    <div className="flex flex_jc_c">
                      <div className={styles.btn} onClick={()=>this.submitSignIn()}>登入</div>
                    </div>
                  </div>
    return render
  }

  renderRegister () {
    let render  = <div className={styles.register}>
                    <div className={styles.top_tip}>
                      <div>請輸入您想在本站註冊的電子郵件與密碼</div>
                    </div>
                    <div className={styles.name + " " + styles.custom_css}>
                      <div>
                        <label>真實姓名:</label>
                        <input ref="name" />
                      </div>
                      <div>
                        <label></label>
                        <div>*請使用真實姓名註冊</div>
                      </div>
                    </div>
                    <div className={styles.email + " " + styles.custom_css}>
                      <div>
                        <label>電子郵件:</label>
                        <input ref="email" type="email" />
                      </div>
                      <div>
                        <label></label>
                        <div>*請輸入電子郵件位址</div>
                      </div>
                    </div>
                    <div className={styles.password + " " + styles.custom_css}>
                      <div>
                        <label>用戶密碼:</label>
                        <input ref="password" type="password" />
                      </div>
                      <div>
                        <label></label>
                        <div>*{ constants.VIEW_TEXT_MEMBER_1 }</div>
                      </div>
                    </div>
                    <div className={styles.confirm_password + " " + styles.custom_css}>
                      <div>
                        <label>確認密碼:</label>
                        <input ref="confirm_password" type="password" />
                      </div>
                      <div>
                        <label></label>
                        <div>*請再次輸入密碼</div>
                      </div>
                    </div>
                    <div className={styles.company_name + " " + styles.custom_css}>
                      <div>
                        <label>公&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;司:</label>
                        <input ref="company_name" />
                      </div>
                    </div>
                    <div className={styles.job_title + " " + styles.custom_css}>
                      <div>
                        <label>職&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;稱:</label>
                        <input ref="job_title" />
                      </div>
                    </div>
                    <div className={styles.captcha}>
                      <label>驗證碼</label><img src="http://placehold.it/80x40" />
                    </div>
                    <div className="flex flex_jc_c">
                      <div className={styles.btn} onClick={()=>this.submitRegister()}>註冊</div>
                    </div>
                  </div>
    return render
  }

  submitSignIn () {

    let email = this.refs.email.value
    let password = this.refs.password.value

    if( !isEmail(email) ) {
      alert("電子郵件格式不符")
    }
    else if( !isPassword(password) ) {
      alert("用戶密碼格式不符")
    }
    else {
      this.props.dispatch( apiMemberSignIn( location.origin, email, password ) )
    }
  }

  submitRegister () {

    let name = this.refs.name.value
    let email = this.refs.email.value
    let password = this.refs.password.value
    let confirm_password = this.refs.confirm_password.value
    let company_name = this.refs.company_name.value
    let job_title = this.refs.job_title.value

    if( !isChinese(name) ) {
      alert("真實姓名必須為中文字")
    }
    else if( !isEmail(email) ) {
      alert("電子郵件格式不符")
    }
    else if( !isPassword(password) ) {
      alert("用戶密碼格式不符")
    }
    else if( confirm_password != password ) {
      alert("密碼不一致")
    }
    else {
      this.props.dispatch( apiMemberRegister( location.origin, name, email, password, company_name, job_title ) )
        .then( res => {

          if( res.data.status == 1 ) {

            alert( constants.VIEW_TEXT_MEMBER_2 )
            window.location.href = '/'
          }
          else 
            alert( res.data.error.error_msg )
        })
    }
  }

  render () {
    // console.log(this.props);
    let tab = this.state.tab
    let render = <Loader />

    return (
      <div className={styles.member}>
        <div>
          <IconTitle icon_classname="fa fa-home" title="會員登入/註冊" color="#000" />
        </div>
        <div className="form_bg">
          <div className="form_bg_border">
            <div className={styles.form}>
              <div className={styles.tabs}>
                <BtnTab text="登入" active={ tab == "sign_in" ? "active" : null } changeTab={()=>this.changeTab("sign_in")} />
                <BtnTab text="註冊" active={ tab == "register" ? "active" : null } changeTab={()=>this.changeTab("register")} />
              </div>
              { this.renderPage(tab) }      
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  let api_data = state.member
  if(!isEmpty(api_data) && api_data.member_status != 0 ) {

    if( api_data.member_info.status == 0 && api_data.member_info.error.error_code == "00001" ) {
      window.location.href="/error" //系統維護中
    }
    else if(api_data.member_info.status == 0) {
      console.log(api_data.member_info.error.error_msg)
    }
  }

  // console.log(state);
  return {
    member: state.member
  }
}

export default connect(mapStateToProps)(withRouter(MemberLogIn))
