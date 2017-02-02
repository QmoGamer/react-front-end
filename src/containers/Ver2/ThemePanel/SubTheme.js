import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Loader from '../../../components/Loader/Loader'
import IconTitle from '../../../components/IconTitle/IconTitle'
import ThemeArticleList from '../../../components/Ver2/ThemeArticleList/ThemeArticleList'

import styles from './ThemePanel.css'
import { apiNewSubThemeArticle, apiHotSubThemeArticle, selectTheme } from '../../../actions/theme'
import { isEmpty, arrayPaging } from '../../../utils'
const constants = require('../../../constants')

class SubTheme extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      data: [],
      tab: 'hot', 
      is_enable: true,
      loading: true,
      page: 1
    }
  }

  componentDidMount () {

    const { tab } = this.state
    const { theme_id, sub_theme_id } = this.props.params

    this.dispatchThemeArticle( tab, 1 )
    this.props.dispatch( selectTheme( theme_id, sub_theme_id  ) )
  }
  
  componentDidUpdate () {
  
    const { data, loading } = this.state

    if( !isEmpty( data ) && loading == true ) {
      this.setState({ loading: false })
    }
  }

  dispatchThemeArticle ( tab, page ) {
    // console.log( tab, sub_theme_id, page );
    const member_cookie = window.sessionStorage.getItem("cookie") || ''
    const auth_token = window.sessionStorage.getItem("token") || ''
    const { sub_theme_id } = this.props.params

    if ( tab == "new" ) {
      this.props.dispatch( apiNewSubThemeArticle( location.origin, member_cookie, auth_token, sub_theme_id, page ) )
        .then( res => this.handleApiResult( res ) )
    }
    else if ( tab == "hot" ) {
      this.props.dispatch( apiHotSubThemeArticle( location.origin, member_cookie, auth_token, sub_theme_id, page ) )
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
      this.dispatchThemeArticle( tab, 1 )
      setTimeout( function(){ this.setState({ is_enable: true }) }.bind(this), 1000 )
    }
  }

  onChangePage ( page ) {

    const { tab } = this.state

    this.setState({ page: page, data: [], loading: true })
    this.dispatchThemeArticle( tab, page )
  }

  renderTitle() {

    const { theme } = this.props
    const { theme_id, sub_theme_id } = this.props.params

    let theme_name = ''
    let sub_theme_name = ''
    
    theme.result.map((x, y)=>{

      if( x.id == theme_id ) {

        theme_name = x.name
        x.subboard.map((x2, y2)=>{

          if ( x2.id == sub_theme_id ) {

            sub_theme_name = x2.name
          }
        })
      }
    })

    return (
      <div className={ styles.title }>
        <a href="/"><IconTitle title="首頁" color="#000" /></a>
        <div> > </div>
        <a href={ "/theme/" + theme_id }>{ theme_name }</a>
        <div> > </div>
        <a href={ "/theme/" + theme_id + "/" + sub_theme_id }>{ sub_theme_name }</a>
      </div>
    )
  }

  renderList () {

    const { data } = this.state
    const { member } = this.props
    // console.log( data )
    // 錯誤檢查 etc, page大於total_page
    if( data.page_content == undefined ) {
      window.location.href = "/"
    }
    else if ( data.page_content.length == 0 )
      return <div>{ constants.VIEW_TEXT_ARTICLE_2 }</div>
    else
      return <ThemeArticleList data={ data.page_content } member={ member } />
  }

  renderPage () {

    const { data } = this.state
    const array = arrayPaging( data.page, data.total_page )

    let render = array.map((x, y)=>{
      let css = x == data.page ? styles.active : null
      return <div key={ 'page' + y } onClick={ ()=> this.onChangePage(x) } className={ styles.btn_page + " " + css }>{x}</div>
    })

    return <div className="rows_btn_type1">{render}</div>
  }

  render () {
    // console.log( this.props )
    const { tab, loading } = this.state
    let render_title = <Loader />
    let render_list = <Loader />
    let render_page = <Loader />

    if( loading == false ) {
      render_title = this.renderTitle()
      render_list = this.renderList()
      render_page = this.renderPage()
    }

    return (
      <div className={styles.theme}>
        { render_title }
        <div className="bg_type1">
          <div className="border_type1">
            <div className={styles.tabs}>
              <div className={ tab == "hot" ? styles.active : null } onClick={ ()=> this.onChangeTab("hot") }>熱門</div>
              <div className={ tab == "new" ? styles.active : null } onClick={ ()=> this.onChangeTab("new") }>最新</div>
            </div>
            { render_list }
            { render_page }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    theme: state.home.theme,
    member: state.member
  }
}

export default connect(mapStateToProps)(SubTheme)
