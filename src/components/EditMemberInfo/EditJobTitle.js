import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './EditMemberInfo.css'

import { apiUpdateMemberInfo } from '../../actions/member'
import { isEmpty } from '../../utils'
const constants = require('../../constants')

class EditJobTitle extends Component {

	constructor (props) {
    super(props)
    this.state = { is_editing: false, job_title: props.member.job_title }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onEdit ( bool ) {

    this.setState({ is_editing: bool })
  }

  onSubmit () {

    const { member_cookie, token } = this.props.member
    const job_title = this.refs.job_title.value

    if ( isEmpty(job_title) ) {
      alert( constants.VIEW_TEXT_MEMBER_1 )
    }
    else {

      this.props.dispatch( apiUpdateMemberInfo( location.origin, member_cookie, token, 'job_title', job_title ) )
        .then( res => {
          
          if( res.data.status == 1 ) {

            window.sessionStorage["job_title"] = job_title
            this.setState({ is_editing: false, job_title: job_title })
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  renderRow () {

    const { is_editing, job_title } = this.state

    if ( is_editing == true ) {
      return (
        <div className={ styles.field }>
          <div><input ref="job_title" defaultValue={ job_title } /></div>
          <div className={ styles.btns }>
            <div className={ styles.btn_submit } onClick={ this.onSubmit }>確認變更</div>
            <div className={ styles.btn_cancel } onClick={ ()=> this.onEdit( false ) }>取消</div>
          </div>
        </div>
      )
    }
    else {
      return <div>{ job_title }</div>
    }
  }

  render () {

    const { is_editing } = this.state

    const css_bgcolor = is_editing == true ? styles.bgcolor : null
    const render_btn = is_editing == true ? null : <div onClick={ ()=> this.onEdit( true ) } className="btn_edit_pen_type"></div>

    return (
      <div className={ styles.row + " " + css_bgcolor }>
        <div>職稱</div>
        { this.renderRow() }
        <div>
          { render_btn }
        </div>
      </div>
    )
  }
}

export default connect()(EditJobTitle)
