import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { apiNewThemeArticle, apiHotThemeArticle, selectTheme } from '../../actions/theme'
import styles from './Theme.css'
import { isEmpty } from '../../utils'
import Loader from '../../components/Loader/Loader'

import IconTitle from '../../components/IconTitle/IconTitle'
import BtnTab from '../../components/BtnTab/BtnTab'
import CategorySub from '../../components/CategorySub/CategorySub'
import ThemePanel from '../../components/ThemePanel/ThemePanel'

class Theme extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { tab: 'new', loading: 1 }
  }

  componentWillReceiveProps (nextProps) {

    if( nextProps.params.theme_id != this.props.params.theme_id ) {
      this.setState({ 'loading': 1 })
      let tab = this.state.tab
      let member_cookie = this.props.member.member_status == 2 ? this.props.member.member_info.member_cookie : ''
      let auth_token = this.props.member.member_status == 2 ? this.props.member.member_info.token : ''

      this.dispatchThemeArticle( tab, nextProps.params.theme_id, member_cookie, auth_token )
    }
  }

  componentDidMount () {

    let tab = this.state.tab
    let member_cookie = window.sessionStorage.getItem("cookie") || ''
    let auth_token = window.sessionStorage.getItem("token") || ''

    this.dispatchThemeArticle( tab, this.props.params.theme_id, member_cookie, auth_token )
    this.props.dispatch( selectTheme( this.props.params.theme_id, 0 ) )
  }

  componentDidUpdate (prevProps, prevState) {
  
    if( prevProps.theme_article != this.props.theme_article && this.state.loading == 1 ) {
      this.setState({ 'loading': 0 })
    }
  }

  dispatchThemeArticle ( tab, theme_id, member_cookie, auth_token ) {

    if ( tab == "new" ) {
      this.props.dispatch( apiNewThemeArticle( location.origin, theme_id, member_cookie, auth_token ))
    }
    else if ( tab == "hot" ) {
      this.props.dispatch( apiHotThemeArticle( location.origin, theme_id, member_cookie, auth_token ))
    }
  }

  changeTab (tab, theme_id) {

    let member_cookie = this.props.member.member_status == 2 ? this.props.member.member_info.member_cookie : ''
    let auth_token = this.props.member.member_status == 2 ? this.props.member.member_info.token : ''

    this.dispatchThemeArticle( tab, theme_id, member_cookie, auth_token )
    this.setState({"tab": tab, "loading": 1})
  }

  renderSubThemeList ( theme, theme_id ) {

    let render = <Loader />
    if( theme != undefined ) {

      let select_theme = theme.result.filter((x, y)=>x.id == theme_id)
      render =  <div className={styles.category_subs}>
                  {
                    select_theme[0].subboard.map((x, y)=><CategorySub key={"category_sub_"+y} {...x} theme_id={theme_id} />)
                  }
                </div>
    }
    return render
  }

  renderThemeArticle ( theme_article, member, theme_id ) {
    
    let render =  <Loader />

    if( theme_article != undefined  && this.state.loading == 0 ) {
      // console.log(theme_article);
      if( theme_article.status == 1 && theme_article.result.length > 0 ) {
        render =  <div className={styles.panels}>
                    {
                      theme_article.result.map((x, y)=><ThemePanel key={"theme_panel"+y} {...x} theme_id={theme_id} article_path="/theme_detail" member={member} dispatch={this.props.dispatch} />)
                    }
                  </div>
      }
      else {
        // console.log(theme_article.error.error_code);
        render = <div style={{textAlign: "center"}}>沒有文章...</div>
      }
    }
    return render
  }

  renderTitle ( theme, theme_id ) {

    let render = <Loader />
    if( theme != undefined ) {

      let title = ""
      theme.result.map((x, y)=>{
        if(x.id == theme_id) {
          title = x.name
        }
      })

      render =  <div style={{"padding": "0.5rem"}}>
                  <IconTitle icon_classname="fa fa-home" title={title} color="#000" />
                </div>
    }
    return render
  }

  render () {
    console.log(this.props);
    const { theme, theme_article, member } = this.props
    const theme_id = this.props.params.theme_id
    // console.log(this.props);

    return (
      <div className={styles.category}>
        <div>
          <div style={{"padding": "0.5rem"}}>
            { this.renderTitle( theme, theme_id ) }
          </div>
          { this.renderSubThemeList( theme, theme_id ) }
        </div>
        <div className={styles.tabs}>
          <BtnTab text="最新" active={this.state.tab == "new" ? "active" : null} changeTab={()=>this.changeTab("new", theme_id)} />
          <BtnTab text="熱門" active={this.state.tab == "hot" ? "active" : null} changeTab={()=>this.changeTab("hot", theme_id)} />
        </div>
        { this.renderThemeArticle( theme_article, member, theme_id ) }
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    member: state.member,
    theme_article: state.theme.theme_article,
    theme: state.home.theme
  }
}

export default connect(mapStateToProps)(Theme)
