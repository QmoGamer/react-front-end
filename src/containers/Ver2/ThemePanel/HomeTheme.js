import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Loader from '../../../components/Loader/Loader'
import ThemeArticleList from '../../../components/Ver2/ThemeArticleList/ThemeArticleList'

import styles from './ThemePanel.css'
import { apiNewHomeThemeArticle, apiHotHomeThemeArticle } from '../../../actions/theme'
import { isEmpty } from '../../../utils'
const constants = require('../../../constants')

class HomeTheme extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      data: [],
      tab: 'hot', 
      is_enable: true,
      loading: true
    }
  }

  componentDidMount () {

    const { tab } = this.state

    this.dispatchThemeArticle( tab )
  }
  
  componentDidUpdate (prevProps, prevState) {
  
    const { data, loading } = this.state

    if( !isEmpty( data ) && loading == true ) {
      this.setState({ loading: false })
    }
  }

  dispatchThemeArticle ( tab ) {
    // console.log( tab, sub_theme_id, page );
    let member_cookie = window.sessionStorage.getItem("cookie") || ''
    let auth_token = window.sessionStorage.getItem("token") || ''

    if ( tab == "new" ) {
      this.props.dispatch( apiNewHomeThemeArticle( location.origin, member_cookie, auth_token ) )
        .then( res => this.handleApiResult( res ) )
    }
    else if ( tab == "hot" ) {
      this.props.dispatch( apiHotHomeThemeArticle( location.origin, member_cookie, auth_token ) )
        .then( res => this.handleApiResult( res ) )
    }
  }

  handleApiResult ( res ) {
    // console.log( res )
    if( res.data.status == 1 ) {

      this.setState({ data: res.data.result })
    }
    else 
      alert( res.data.error.error_msg )
  }

  onChangeTab ( tab ) {

    const { is_enable } = this.state

    if ( is_enable == true ) {

      this.setState({ tab: tab, data: [], loading: true, is_enable: false })
      this.dispatchThemeArticle( tab )
      setTimeout( function(){ this.setState({ is_enable: true }) }.bind(this), 1000 )
    }
  }

  renderList () {

    const { data } = this.state
    const { member } = this.props

    // 錯誤檢查 etc, page大於total_page
    if( data.page_content == undefined ) 
      window.location.href = "/"
    else if ( data.page_content.length == 0 )
      return <div>{ constants.VIEW_TEXT_ARTICLE_2 }</div>
    else
      return <ThemeArticleList data={ data.page_content } member={ member } />
  }

  render () {
    // console.log( this.state )
    const { tab, loading } = this.state
    let render_list = <Loader />

    if( loading == false ) {
      render_list = this.renderList()
    }

    return (
      <div className={styles.theme}>
        <div className="bg_type1">
          <div className="border_type1">
            <div className={styles.tabs}>
              <div className={ tab == "hot" ? styles.active : null } onClick={ ()=> this.onChangeTab("hot") }>熱門</div>
              <div className={ tab == "new" ? styles.active : null } onClick={ ()=> this.onChangeTab("new") }>最新</div>
            </div>
            { render_list }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    member: state.member
  }
}

export default connect(mapStateToProps)(HomeTheme)
