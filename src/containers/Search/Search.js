import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './Search.css'
import { searchArrticle } from '../../actions/article'
import { isEmpty, yyyymmdd } from '../../utils'
import Loader from '../../components/Loader/Loader'
import ReactHtmlParser from 'react-html-parser'
const constants = require('../../constants')

import IconTitle from '../../components/IconTitle/IconTitle'
import BtnPage from '../../components/BtnPage/BtnPage'

class Search extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { loading: true, data: [] }
  }

  componentDidMount () {

    let member_cookie = window.sessionStorage.getItem("cookie") || ''
    let auth_token = window.sessionStorage.getItem("token") || ''
    const { keyword, page } = this.props.params

    this.props.dispatch( searchArrticle( location.origin, member_cookie, auth_token, keyword, page ) )
      .then( res => this.handleApiResult( res ) )
  }

  componentWillReceiveProps (nextProps) {
    // console.log("will");
    if( nextProps.params.page != this.props.params.page || nextProps.params.keyword != this.props.params.keyword ) {

      this.setState({ loading: true, data: [] })

      let member_cookie = window.sessionStorage.getItem("cookie") || ''
      let auth_token = window.sessionStorage.getItem("token") || ''
      const { keyword, page } = nextProps.params

      this.props.dispatch( searchArrticle( location.origin, member_cookie, auth_token, keyword, page ) )
        .then( res => this.handleApiResult( res ) )
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log(isEmpty(this.state.data));
    if( prevState.data != this.state.data && this.state.loading == true ) {

      this.setState({ loading: false })
    }
  }

  handleApiResult (res) {
    // console.log(res)
    if( res.data.status == 1 ) {

      this.setState({ data: res.data.result })
    }
    else 
      alert( res.data.error.error_msg )
  }

  renderTitle(keyword) {
    
    let render =  <div className="breadcrumb">
                    <IconTitle icon_classname="fa fa-home" title={ "搜尋 > " + keyword } />
                  </div>
    return render
  }

  renderList (data, keyword) {
    // console.log(data)
    let render = <div className={ styles.rows }>{ constants.VIEW_TEXT_SEARCH_LIST_1 + keyword + constants.VIEW_TEXT_SEARCH_LIST_2}</div>

    if ( data.page_content != 0 ) {

      render = data.page_content.map((x, y)=>{

        let link = x.type == '文章' ? '/theme_detail/'+x.article_id : '/news_detail/'+x.news_id

        return (
          <div key={ "search" + y } className={ "rows_type1 " + styles.rows }>

            <div style={{flex: 1}} className={ styles.box_1 }>
              <div>{ yyyymmdd(x.post_time) }</div>
              <div>{ x.type }</div>
            </div>
            <div style={{flex: 9}} className="flex">
              <div style={{flex: 1}}><a href={link}><img src={ x.photo_path == null ? constants.DEFAULT_COVER : constants.API_HOST+x.photo_path } /></a></div>
              <a href={link} style={{flex: 8}} className={ "flex flex_ai_c " + styles.box_2 }>
                <div style={{flex: 2}} className={ styles.title + " " + styles.ellipsis }>{ x.title }</div> 
                <div style={{flex: 6}} className={ styles.content + " " + styles.ellipsis }>{ ReactHtmlParser(x.content) }</div>
              </a>
            </div>
          </div>
        )
      })
    }

    return render
  }

  renderPage ( data, keyword ) {

    let render = <BtnPage page={parseInt(data.page)} total_page={parseInt(data.total_page)} path={"/search/"+keyword} />

    return render
  }

  render() {
    // console.log(this.props);
    const { keyword, page } = this.props.params

    let render_title = <Loader />
    let render_list = <Loader />
    let render_page = <Loader />
    let { data, loading } = this.state

    if( loading == false ) {
      render_title = this.renderTitle( keyword )
      render_list = this.renderList( data, keyword )
      render_page = this.renderPage( data, keyword )
    }

    return (
      <div className={ styles.search_list }>
        { render_title }
        <div>
          <div className="bg_type1">
            <div className="border_type1">
              <div className={"rows_type1 " + styles.header }>
                <div style={{flex: 1}}>發文日期</div>
                <div style={{flex: 1}}></div>
                <div style={{flex: 2}} className={ styles.title }>標題</div> 
                <div style={{flex: 6}} className={ styles.content }>內容</div>
              </div>
              <div className={styles.hr}></div>
              { render_list }
              <div className="rows_btn_type1">
                { render_page }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state)
  return { 
    // member: state.member
    // news: state.news
    // news_paging: state.toggleSidebar,
  }
}

export default connect(mapStateToProps)(Search)