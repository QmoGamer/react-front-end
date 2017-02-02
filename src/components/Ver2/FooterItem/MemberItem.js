import React, { Component, PropTypes } from 'react'

import styles from './MemberItem.css'

const constants = require('../../../constants')

export default class MemberItem extends Component {

  constructor (props) {
    super(props)
  }

  onSignOut () {

    if( confirm("確定要登出嗎?") ) {
     
      window.sessionStorage.clear()
      window.location.href = '/'
    }
  }

  renderMember () {

    return (
      <div className={ styles.member }>
        <div onClick={ ()=> window.location.href="/post_article" }>{ constants.VIEW_TEXT_ARTICLE_3 }</div>
        <div onClick={ ()=> window.location.href="/my/edit/member_info" }>{ constants.VIEW_TEXT_FOOTER_MENU_1 }</div>
        <div onClick={ ()=> this.onSignOut() }>{ constants.VIEW_TEXT_MEMBER_MENU_5 }</div>
      </div>
    )
  }

  render () {
    // console.log( this.props )
    const { member } = this.props

    let render_member = member.member_status == 0 ? null : this.renderMember()

    return <div>{ render_member }</div>
  }
}
