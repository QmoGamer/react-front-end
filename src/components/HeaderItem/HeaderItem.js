import React, { Component } from 'react'
import { Link } from 'react-router'
import styles from './HeaderItem.css'
import BtnTab from '../BtnTab/BtnTab'
import { isEmpty } from '../../utils.js'
const constants = require('../../constants');

export default class HeaderItem extends Component {

  constructor (props) {
    super(props)
    this.searchArticle = this.searchArticle.bind(this)
    this._handleKeyPress = this._handleKeyPress.bind(this)
  }

  searchArticle () {

    let keyword = this.refs.keyword.value

    if( !isEmpty(keyword) ) 
      window.location.href = '/search/' + keyword + "/1"
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.searchArticle()
    }
  }

  render() {

    const { toggle, 
            changeSidebarState, 
            isLogin, 
            member_nickname, 
            member_pro_pic, 
            goPostArticle, 
            my_tab, 
            changeMyTab, 
            member_menu,
            toggleMemberMenu,
            memberLogout
          } = this.props 

    let member_render = <div className={styles.header_right + " flex flex_ai_c"}>
                          <Link to="/member_login" className={styles.btn_login}>會員登入</Link>
                          <div style={{"padding": "1rem"}}> | </div>
                          <Link to="/member_register" className={styles.btn_register}>註冊</Link>
                          <div></div>
                        </div>
    let member_icon = <a href="/member_login"><img src={constants.VIEW_ICON_TEMP_MEMBER} width='32px' /></a>
    let header_tabs = null

    if( isLogin == 1 ) {

      member_icon = <img src={constants.VIEW_ICON_TEMP_MEMBER} width="40" height="40" />
      member_render = <div className={styles.header_right + " flex flex_ai_c"}>
                        <div className={styles.member_icon} onClick={()=>toggleMemberMenu()}>{member_icon}</div>
                        <div className={styles.nickname}>{member_nickname}</div>
                        <div className={"rows_edit " + styles.logout} onClick={()=>memberLogout()} style={{ display: member_menu == false ? "none" : "block" }}>登出</div>
                      </div>
      //my tab
      header_tabs = <div className={styles.header_tabs}>
                      <div onClick={()=>changeMyTab(1)}><BtnTab text="追蹤訂閱" active={my_tab==1 ? 'active' : null} color_type="2" /></div>
                      <div onClick={()=>changeMyTab(2)}><BtnTab text="收藏文章" active={my_tab==2 ? 'active' : null} color_type="2"  /></div>
                      <div onClick={()=>changeMyTab(3)}><BtnTab text="我的文章" active={my_tab==3 ? 'active' : null} color_type="2" /></div>
                    </div>
    }

    return (
      <div>
        <div className="flex flex_ai_c">            
          <button className={styles.btn_bars} onClick={()=>changeSidebarState(toggle)}><i className="fa fa-bars fa-lg"></i></button>
          <div className={styles.header_left + " flex flex_ai_c"} style={{ fontSize: "20px" }}>
            <Link to="/" className={styles.header_title}>{constants.WEB_TITLE}</Link>
          </div>
          { member_render }
          <div className={styles.header_right_icon}>
            { member_icon }
          </div>
        </div>
        <div style={{height: "40px"}}>
          <div className={styles.header_search}>
            <Link to="/post_article" className={styles.btn_post_article}><img style={{padding: "4px"}} src={constants.VIEW_ICON_PEN} width="32px" /></Link>
            <input ref="keyword" type="search" placeholder="搜尋" className={styles.header_search_input} onKeyPress={ this._handleKeyPress }/>
            <button className={styles.btn_search} onClick={this.searchArticle}><i className="fa fa-search"></i></button>
          </div>
        </div>
        { header_tabs }
      </div>
    );
  }
}
