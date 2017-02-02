import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import styles from './NewsList.css'
import { apiGetNewsList } from '../../actions/news'
import { isEmpty, yyyymmdd } from '../../utils'
import Loader from '../../components/Loader/Loader'
const constants = require('../../constants')

import IconTitle from '../../components/IconTitle/IconTitle'
import BtnPage from '../../components/BtnPage/BtnPage'

class NewsList extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { loading: 1 }
  }

  componentDidMount () {

    let member_cookie = window.sessionStorage.getItem("cookie") || ''
    let auth_token = window.sessionStorage.getItem("token") || ''

    this.props.dispatch( apiGetNewsList( location.origin, this.props.params.page, member_cookie, auth_token ) )
  }

  componentWillReceiveProps (nextProps) {
    // console.log("will");
    if( nextProps.params.page != this.props.params.page ) {
      this.setState({ loading: 1 })

      let member_cookie = this.props.member.member_status == 2 ? this.props.member.member_info.member_cookie : ''
      let auth_token = this.props.member.member_status == 2 ? this.props.member.member_info.token : ''

      this.props.dispatch( apiGetNewsList( location.origin, nextProps.params.page, member_cookie, auth_token ) )
    }
  }

  componentDidUpdate (prevProps, prevState) {
  
    if( prevProps.news.news_list != this.props.news.news_list && this.state.loading == 1 ) {
      this.setState({ loading: 0 })
    }
  }

  renderNewsList ( news ) {

    let render = <Loader />

    if( news != undefined && this.state.loading == 0 ) {

      if ( news.content != null && news.content.length != 0 )
        render = news.content.map((x, y)=>{
          // console.log(x);
          let type = x.issticky == 0 ? <div className="fa fa-home">{ x.type }</div> : <div className="fa fa-home" style={{color: "#f00"}}><font color="#f00">{ x.type }置頂</font></div>
          let likes = x.type != '公告' ? <span>{x.like_count}<span className={ styles.likes }>讚</span></span> : null
          let follows = x.type != '公告' ? <span>{x.collected_count}<span className={ styles.follows }>收藏</span></span> : null
          return ( 
            <div key={"news_"+y} className={ styles.rows }>
              <div style={{flex: 2}} className={ styles.post_date }>
                <div>{ yyyymmdd(x.post_time) }</div>
                { type }
              </div>
              <div style={{flex: 10, display: "flex"}}>
                <div></div>
                <div style={{flex: 8}} className={ styles.flex_box_1 }>
                  <div style={{ flex: 6 }} className={"ellipsis " + styles.title }>
                    <a href={"/news_detail/" + x.id }>{ x.title }</a>
                  </div>
                  <div style={{ flex: 2 }} className={ styles.likes_row }>
                    <div style={{ flex: 1 }}>{ likes }</div>
                    <div style={{ flex: 1 }}>{ follows }</div>
                  </div>
                </div>
                <div style={{flex: 2}}></div>
              </div>
            </div>
          )
      })
      else {
        render = <div className={ styles.rows }>{ constants.VIEW_TEXT_NEWS_LIST_1 }</div>
      }
    }

    return render
  }

  renderPaging ( news ) {

    let render = <Loader />

    if ( news != undefined )
      render = <BtnPage page={parseInt(news.page)} total_page={parseInt(news.total_page)} path="/news_list" />

    return render
  }

  render() {
    // console.log(this.props);
    const { news } = this.props
    const page = this.props.params.page

    return (
      <div className={ styles.news_list }>
        <div className="breadcrumb">
          <IconTitle icon_classname="fa fa-home" title="首頁 > 新聞與公告" />
        </div>
        <div>
          <div className={ styles.bg }>
            <div className={ styles.border }>
              <div className={ styles.rows + " " + styles.header }>
                <div style={{flex: 2}}>發文日期</div>
                <div></div>
                <div style={{flex: 6}}>標題</div>
                <div style={{flex: 1, textAlign: "center"}}>讚</div>
                <div style={{flex: 1, textAlign: "center"}}>收藏</div>
                <div style={{flex: 2}}></div>
              </div>
              { this.renderNewsList( news.news_list ) }
              <div className={ styles.rows_btn }>
                { this.renderPaging( news.news_list ) }
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
    member: state.member,
    news: state.news
    // news_paging: state.toggleSidebar,
  }
}

export default connect(mapStateToProps)(NewsList)