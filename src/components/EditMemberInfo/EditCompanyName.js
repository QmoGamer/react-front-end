import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './EditMemberInfo.css'

import { apiUpdateMemberInfo } from '../../actions/member'
import { isEmpty } from '../../utils'
const constants = require('../../constants')

class EditCompanyName extends Component {

	constructor (props) {
    super(props)
    this.state = { is_editing: false, company_name: props.member.company_name }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onEdit ( bool ) {

    this.setState({ is_editing: bool })
  }

  onSubmit () {

    const { member_cookie, token } = this.props.member
    const company_name = this.refs.company_name.value

    if ( isEmpty(company_name) ) {
      alert( constants.VIEW_TEXT_MEMBER_1 )
    }
    else {

      this.props.dispatch( apiUpdateMemberInfo( location.origin, member_cookie, token, 'company_name', company_name ) )
        .then( res => {
          
          if( res.data.status == 1 ) {

            window.sessionStorage["company_name"] = company_name
            this.setState({ is_editing: false, company_name: company_name })
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  renderRow () {

    const { is_editing, company_name } = this.state

    if ( is_editing == true ) {
      return (
        <div className={ styles.field }>
          <div><input ref="company_name" defaultValue={ company_name } /></div>
          <div className={ styles.btns }>
            <div className={ styles.btn_submit } onClick={ this.onSubmit }>確認變更</div>
            <div className={ styles.btn_cancel } onClick={ ()=> this.onEdit( false ) }>取消</div>
          </div>
        </div>
      )
    }
    else {
      return <div>{ company_name }</div>
    }
  }

  render () {

    const { is_editing } = this.state

    const css_bgcolor = is_editing == true ? styles.bgcolor : null
    const render_btn = is_editing == true ? null : <div onClick={ ()=> this.onEdit( true ) } className="btn_edit_pen_type"></div>

    return (
      <div className={ styles.row + " " + css_bgcolor }>
        <div>公司</div>
        { this.renderRow() }
        <div>
          { render_btn }
        </div>
      </div>
    )
  }
}

export default connect()(EditCompanyName)
