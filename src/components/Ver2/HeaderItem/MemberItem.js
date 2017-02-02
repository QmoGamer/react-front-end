import React, { Component, PropTypes } from 'react'

import styles from './MemberItem.css'

import { checkImg } from '../../../utils'
const constants = require('../../../constants')

export default class MemberItem extends Component {

	constructor (props) {
    super(props)
    this.state = { member_menu_toggle: false }
    this.memberMenuToggle = this.memberMenuToggle.bind(this)
  }

  memberMenuToggle ( bool ) {

    document.body.style.overflow = bool == true ? 'hidden' : 'auto'

    this.setState({ member_menu_toggle: bool })
  }

  onSignOut () {

    if( confirm("確定要登出嗎?") ) {

      window.sessionStorage.clear()
      window.location.href = '/'
    }
  }

  renderNotSignIn () {

    return (
      <div className={ styles.member + " " + styles.not_sign_in }>
        <div className={ styles.desktop }>
          <a href='/member_login'>會員登入</a>
          <div style={{ margin: "0 10px" }}>|</div>
          <a href='/member_register'>註冊</a>
        </div>
        <a href='/member_login' className={ styles.mobile }>
          <div className={ styles.member_icon }>
            <img src={ constants.VIEW_ICON_TEMP_MEMBER } />
          </div>
        </a>
      </div>
    )
  }

  renderSignIn () {

    const { member, notifications } = this.props
    const { member_menu_toggle } = this.state
    
    let member_icon = checkImg( member.member_info.photo_path )
    let member_menu_active = member_menu_toggle == true ? styles.active : ''
    let render_notification = ''

    if ( notifications > 0 )
      render_notification = notifications > 999 ? this.renderNotification( '999+' ) : this.renderNotification( notifications )

    return (
      <div className={ styles.member }>
        <div className={ styles.member_icon }>
          <img width="40px" height="40px" src={ member_icon } onClick={ ()=> this.memberMenuToggle( !member_menu_toggle ) } />
          { render_notification }
          <div className={ "rows_edit " + styles.member_menu + " " + member_menu_active }>
            <div onClick={ ()=> window.location.href='/my/edit/member_info' }>{ constants.VIEW_TEXT_MEMBER_MENU_1 }</div>
            <div onClick={ ()=> window.location.href='/my/follow/1' }>{ constants.VIEW_TEXT_MEMBER_MENU_2 }</div>
            <div onClick={ ()=> window.location.href='/my/collect/1' }>{ constants.VIEW_TEXT_MEMBER_MENU_3 }</div>
            <div onClick={ ()=> window.location.href='/my/post/1' }>{ constants.VIEW_TEXT_MEMBER_MENU_4 }</div>
            <div onClick={ ()=> this.onSignOut() }>{ constants.VIEW_TEXT_MEMBER_MENU_5 }</div>
          </div>
        </div>
        <div className={ styles.member_name }>{ member.member_info.nickname }</div>
        <div className={ styles.member_menu_mask + " " + member_menu_active } onClick={ ()=> this.memberMenuToggle( false ) } ></div>
      </div>
    )
  }

  renderNotification ( notifications_qty ) {

    return <div className={ styles.member_notification }>{ notifications_qty }</div>
  }

  render () {
  	// console.log( this.props )
    const { member } = this.props

    let render_member = member.member_status == 0 ? this.renderNotSignIn() : this.renderSignIn()

		return <div>{ render_member }</div>
  }
}
