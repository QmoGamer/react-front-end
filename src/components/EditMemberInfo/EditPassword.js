import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './EditMemberInfo.css'

import { apiUpdateMemberPassword } from '../../actions/member'
import { isPassword } from '../../utils'
const constants = require('../../constants')

class EditPassword extends Component {

	constructor (props) {
    super(props)
    this.state = { is_editing: false }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onEdit ( bool ) {

    this.setState({ is_editing: bool })
  }

  onSubmit () {

    const { member_cookie, token } = this.props.member
    const password = this.refs.password.value
    const new_password = this.refs.new_password.value
    const confirm_password = this.refs.confirm_password.value

    if( !isPassword(new_password) ) {
      alert("用戶密碼格式不符")
    }
    else if( confirm_password != new_password ) {
      alert("密碼不一致")
    }
    else {

      this.props.dispatch( apiUpdateMemberPassword( location.origin, member_cookie, token, password, new_password, confirm_password ) )
        .then( res => {
          
          if( res.data.status == 1 ) {

            alert("變更成功")
            this.setState({ is_editing: false })
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  renderRow () {

    const { is_editing } = this.state

    if ( is_editing == true ) {
      return (
        <div className={ styles.field }>
          <div>
            <div><div>目前密碼</div><input ref="password" type="password" /></div>
            <div><div>新密碼</div><input ref="new_password" type="password" /></div>
            <div><div>再次輸入新密碼</div><input ref="confirm_password" type="password" /></div>
          </div>
          <div className={ styles.btns }>
            <div className={ styles.btn_submit } onClick={ this.onSubmit }>確認變更</div>
            <div className={ styles.btn_cancel } onClick={ ()=> this.onEdit( false ) }>取消</div>
          </div>
        </div>
      )
    }
    else {
      return <div style={{ color: '#aaa' }}>{ constants.VIEW_TEXT_MEMBER_4 }</div>
    }
  }

  render () {

    const { is_editing } = this.state

    const css_bgcolor = is_editing == true ? styles.bgcolor : null
    const render_btn = is_editing == true ? null : <div onClick={ ()=> this.onEdit( true ) } className="btn_edit_pen_type"></div>

    return (
      <div className={ styles.row + " " + css_bgcolor }>
        <div>用戶密碼</div>
        { this.renderRow() }
        <div>
          { render_btn }
        </div>
      </div>
    )
  }
}

export default connect()(EditPassword)
