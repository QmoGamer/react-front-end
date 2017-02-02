import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './EditMemberInfo.css'

import { apiUpdateMemberInfo, autoLogin } from '../../actions/member'
import { isChinese, getSessionStorageItem } from '../../utils'
const constants = require('../../constants')

class Editname extends Component {

	constructor (props) {
    super(props)
    this.state = { is_editing: false, name: props.member.nickname }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onEdit ( bool ) {

    this.setState({ is_editing: bool })
  }

  onSubmit () {

    const { member_cookie, token } = this.props.member
    const name = this.refs.name.value

    if ( !isChinese(name) ) {
      alert( constants.VIEW_TEXT_MEMBER_3 )
    }
    else {

      this.props.dispatch( apiUpdateMemberInfo( location.origin, member_cookie, token, 'name', name ) )
        .then( res => {
          
          if( res.data.status == 1 ) {

            window.sessionStorage["nickname"] = name
            this.setState({ is_editing: false, name: name })
            // 重新登入替換右上角資料
            this.props.dispatch( autoLogin( getSessionStorageItem() ) )
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  renderRow () {

    const { is_editing, name } = this.state

    if ( is_editing == true ) {
      return (
        <div className={ styles.field }>
          <div><input ref="name" defaultValue={ name } /></div>
          <div className={ styles.btns }>
            <div className={ styles.btn_submit } onClick={ this.onSubmit }>確認變更</div>
            <div className={ styles.btn_cancel } onClick={ ()=> this.onEdit( false ) }>取消</div>
          </div>
        </div>
      )
    }
    else {
      return <div>{ name }</div>
    }
  }

  render () {

    const { is_editing } = this.state

    const css_bgcolor = is_editing == true ? styles.bgcolor : null
    const render_btn = is_editing == true ? null : <div onClick={ ()=> this.onEdit( true ) } className="btn_edit_pen_type"></div>

    return (
      <div className={ styles.row + " " + css_bgcolor }>
        <div>用戶名稱</div>
        { this.renderRow() }
        <div>
          { render_btn }
        </div>
      </div>
    )
  }
}

export default connect()(Editname)
