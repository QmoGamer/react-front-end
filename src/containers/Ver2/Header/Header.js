import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

// import HeaderItem from '../../../components/HeaderItem/HeaderItem'
import Loader from '../../../components/Loader/Loader'
import SearchItem from '../../../components/Ver2/HeaderItem/SearchItem'
import MemberItem from '../../../components/Ver2/HeaderItem/MemberItem'
import ThemeList from '../../../components/Ver2/HeaderItem/ThemeList'
import styles from './Header.css'

import { fetchTheme } from '../../../actions/home'
import { autoLogin, apiMemberSignOut } from '../../../actions/member'
import { isEmpty, getSessionStorageItem } from '../../../utils'
const constants = require('../../../constants')

class Header extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      loading: true,
      menu_toggle: false
    }
    this.menuToggle = this.menuToggle.bind(this)
  }

  componentDidMount () {

    const member_cookie = window.sessionStorage.getItem("cookie");
    const member_token = window.sessionStorage.getItem("token");

    // 自動登入
    if ( member_cookie != undefined || member_token != undefined ) {

      this.props.dispatch( autoLogin( getSessionStorageItem() ) )
    }

    // 取得主題
    this.props.dispatch( fetchTheme( location.origin ) )
  }

  componentDidUpdate () {

    const { theme } = this.props
    const { loading } = this.state

    if ( !isEmpty( theme ) && loading == true ) {

      this.setState({ loading: false })
    }
  }

  menuToggle( bool ) {

    document.body.style.overflow = bool == true ? 'hidden' : 'auto'
    this.refs.burger_menu.style.display = 'flex'
    this.setState({ menu_toggle: bool })
  }

  render() {
    // console.log(this.props);
    const { theme, member, path } = this.props
    const { loading, menu_toggle } = this.state
    let render_desktop_theme_list = <Loader />
    let render_mobile_theme_list = <Loader />

    const css_burger_menu = menu_toggle == false ? styles.burger_menu + " fadeOutLeft animated " : styles.burger_menu + " fadeInLeft animated "

    if ( loading == false ) {

      render_desktop_theme_list = <ThemeList css_type='desktop' theme={ theme.result } path={ path } />
      render_mobile_theme_list = <ThemeList css_type='mobile' theme={ theme.result } path={ path } />
    }
      
    return (
      <header>
        <div className={ styles.header }>
          <div>
            <div className={ styles.btn_burger_menu } onClick={ ()=> this.menuToggle( !menu_toggle ) }>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <a href="/" className={ styles.title }>{ constants.WEB_TITLE }</a>
            <SearchItem css_type="desktop" />
            <MemberItem member={ member } notifications={ 300 } />
          </div>
          <div>
            <Link to="/post_article" className={ styles.post_article_pen }>
              <img src={ constants.VIEW_ICON_PEN } />
              <div className={ styles.pen_text }>發表文章</div>
            </Link>
            { render_desktop_theme_list }
            <SearchItem css_type="mobile" />
          </div>
        </div>
        <div ref="burger_menu" className={ css_burger_menu }>
          <div className={ styles.burger_menu_html }>
            <div className={ styles.burger_menu_header }>
              <div className={ styles.btn_close } onClick={ ()=> this.menuToggle( false ) }></div>
              <div className={ styles.title }>{ constants.WEB_TITLE }</div>
            </div>
            { render_mobile_theme_list }
          </div>
          <div className={ styles.burger_menu_mask } onClick={ ()=> this.menuToggle( false ) }></div>
        </div>
      </header>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state)
  return { 
    theme: state.home.theme,
    member: state.member
  }
}

export default connect(mapStateToProps)(Header)