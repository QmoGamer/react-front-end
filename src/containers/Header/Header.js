import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router' 
import styles from './Header.css'
import { toggleSidebar } from '../../actions/toggleSidebar'
import { changeMyTab } from '../../actions/myTab'
import { autoLogin, apiMemberSignOut } from '../../actions/member'
import HeaderItem from '../../components/HeaderItem/HeaderItem'
import { isEmpty } from '../../utils'

class Header extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { member_menu: false }
    this.changeSidebarState = this.changeSidebarState.bind(this)
    this.changeMyTab = this.changeMyTab.bind(this)
    this.toggleMemberMenu = this.toggleMemberMenu.bind(this)
    this.memberLogout = this.memberLogout.bind(this)
  }

  componentDidMount () {

    if ( this.props.member.member_status == 0 && window.sessionStorage.getItem("cookie") != undefined ) {
      let json = {
        "member_cookie": window.sessionStorage.getItem("cookie"),
        "nickname": window.sessionStorage.getItem("nickname"),
        "photo_path": window.sessionStorage.getItem("pro_pic"),
        "token": window.sessionStorage.getItem("token"),
        "id": window.sessionStorage.getItem("id")
      }
      this.props.dispatch(autoLogin(json))
    }
  }

  componentWillReceiveProps( nextProps ) {

    // console.log( nextProps.member );
    // let member = nextProps.member.member_info
    // if ( member.api_status == 1 ) {
    //   window.sessionStorage.clear()
    //   window.location.reload()
    // }
    // else if ( member.api_status == 0 ) {
    //   alert( member.error_msg )
    //   window.location.reload()
    // }
  }

  changeSidebarState(state) {
    let bool = !state
    this.props.dispatch(toggleSidebar(bool))
  }

  changeMyTab(tab) {
    if(tab != this.props.tab) {
      this.props.dispatch(changeMyTab(tab))
      let url = '/my/post/1'
      switch(tab) {
        case 1:
          url = '/my/follow'
          break;
        case 2:
          url = '/my/collect/1'
          break;
        default:
          break;
      }
      this.props.router.push(url)
    }
  }

  toggleMemberMenu () {

    let bool = this.state.member_menu
    this.setState({ member_menu: !bool })
  }

  memberLogout () {

    if( confirm("確定要登出嗎?") ) {
      let member = this.props.member
      let member_cookie = member.member_info.member_cookie
      let auth_token = member.member_info.token
      this.props.dispatch( apiMemberSignOut( location.origin, member_cookie, auth_token ) )
      window.sessionStorage.clear()
      window.location.href = '/'
    }
  }

  render() {
    // console.log(this.props);
    const { toggleSidebar, member, my_tab, path } = this.props

    let toggle = toggleSidebar.toggle
    let member_menu = this.state.member_menu
    let member_nickname = ""
    let member_pro_pic = ""
    let isLogin = 0
    let css_my = null
    let my_tab_active = null
    let css_mask = member_menu ? 'block' : 'none'

    if ( member.member_status == 2 ) {
      isLogin = 1
      member_nickname = member.member_info.nickname
      member_pro_pic = member.member_info.photo_path
      css_my = styles.my
    }

    if ( !isEmpty(path) ) {
      let p = path.split("/") 
      if(p[1] != "my") {
        my_tab_active = null
      }
      else {
        switch(p[2]) {
          case 'follow':
            my_tab_active = 1
            break
          case 'collect':
            my_tab_active = 2
            break
          default:
            my_tab_active = 3
            break
        }
      }
    }
      
    return (
      <header>
        <div className={styles.header + " " + css_my}>
          <div className={styles.header_padding}>
            <HeaderItem 
              toggle={toggle} 
              changeSidebarState={this.changeSidebarState}
              isLogin={isLogin}
              member_nickname={member_nickname}
              member_pro_pic={member_pro_pic}
              goPostArticle={this.goPostArticle}
              changeMyTab={this.changeMyTab}
              my_tab={my_tab_active}
              member_menu={member_menu}
              toggleMemberMenu={this.toggleMemberMenu}
              memberLogout={this.memberLogout}
            />
          </div>
          <div onClick={this.toggleMemberMenu} style={{ display: css_mask }} className="mask"></div>
        </div>
      </header>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state)
  return { 
    my_tab: state.myTab.tab,
    toggleSidebar: state.toggleSidebar,
    member: state.member
  }
}

export default connect(mapStateToProps)(withRouter(Header))