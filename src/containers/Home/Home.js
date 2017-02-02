import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchNews, fetchAnnouncement, fetchTheme, fetchThemeArticle } from '../../actions/home'
import styles from './Home.css'
import { browserHistory, Link } from 'react-router';
import Loader from '../../components/Loader/Loader'
import { isEmpty } from '../../utils'
import Slider from 'react-slick'

import IconTitle from '../../components/IconTitle/IconTitle'
import TextAboveImg from '../../components/TextAboveImg/TextAboveImg'
import ThemePanel from '../../components/ThemePanel/ThemePanel'
import Ad from '../../components/Ad/Ad'
import ArticleListRow from '../../components/ArticleListRow/ArticleListRow'
import SubCategoryTitle from '../../components/SubCategoryTitle/SubCategoryTitle'
import BtnTab from '../../components/BtnTab/BtnTab'

class Home extends Component {

  static fetchData({ params, store, url }) {
    return store.dispatch( fetchNews(url) )
                .then( store.dispatch( fetchAnnouncement(url) ) )
  }

  constructor (props) {
    super(props)
    this.changeTab = this.changeTab.bind(this)
  }

  componentWillMount () {
    
    this.setState({ "tab": "news" })
  }

  componentWillReceiveProps (nextProps) {
    // console.log('will');
    if( nextProps.news != undefined && nextProps.announcement != undefined && nextProps.theme != undefined && nextProps.theme_article.length == 0) {
      let member = this.props.member
      if( member.member_status != 2 ) {
        nextProps.theme.result.map((x, y)=>{
          this.props.dispatch(fetchThemeArticle(location.origin, x.id))
        })
      }
      else {
        nextProps.theme.result.map((x, y)=>{
          this.props.dispatch(fetchThemeArticle(location.origin, x.id, member.member_info.member_cookie, member.member_info.token))
        })
      }
    }
  }

  componentDidMount () {

    this.props.dispatch( fetchNews(location.origin) )
      .then( this.props.dispatch( fetchAnnouncement(location.origin) ) )
  }

  changeTab (tab) {

    this.setState({"tab": tab})
  }

  renderNews (obj) {

    let settings = {
          dots: true,
          speed: 500
        };

    let render =  <div className={styles.tab_news}>
                    <Slider {...settings}>
                      {
                        obj.result.map((x, y)=><div key={"key2_"+y}><TextAboveImg {...x} rows="2" article_path="/news_detail" /></div>)
                      }
                    </Slider>
                  </div>
    return render;
  }

  renderAnnouncement (obj) {

    let render  = <div className={styles.tab_announcement}>
                    {
                      obj.result.map((x, y)=>{
                        if( y < 5 ) 
                          return <ArticleListRow key={"article_list_row"+y} {...x} article_path="/news_detail" />
                      })
                    }
                  </div>
    return render;
  }

  renderTheme (theme, theme_article, member) {
    // console.log(theme_article);
    let render  = theme.result.map((theme_x, theme_y)=>{
      
                    let render_theme_article = ""
                    theme_article.map((theme_article_x, theme_article_y)=>{
                      if( theme_x.id == theme_article_x.theme_id )
                        render_theme_article = this.renderThemeArticle(theme_article_x.result, member, theme_article_x.theme_id)
                    })           

                    return (
                      <div key={"theme_"+theme_y} className={styles.home_box} id="box">
                        <div className={styles.home_title}>
                          <div style={{"marginRight": "1rem"}}>
                            <Link to={"/theme/"+theme_x.id}><IconTitle icon_classname="fa fa-home" title={theme_x.name} /></Link>
                          </div>
                          {
                            theme_x.subboard.map((x, y)=><SubCategoryTitle key={"sub_category_title"+y} {...x} />)
                          }
                        </div>
                        <div className={styles.home_content}>
                          {
                            render_theme_article
                          }
                        </div>
                      </div>
                    )
                  })
    return render;
  }

  renderThemeArticle (theme_article, member, theme_id) {

    let render = theme_article.map((x, y)=>{
      if( y < 3 )
        return <ThemePanel key={"theme_panel"+y} {...x} theme_id={theme_id} article_path="/theme_detail" member={member} dispatch={this.props.dispatch} />
    })
    return render
  }

  render () {
    // console.log(this.props);
    const { news, announcement, theme, theme_article, member } = this.props
    // console.log(theme_article);

    let render_tab = <Loader />
    let render_announcement = <Loader />
    let render_theme = <Loader />
    let news_active = ""
    let announcement_active = ""

    if( news != undefined && announcement != undefined && theme != undefined && theme_article.length != 0) {

      render_announcement = this.renderAnnouncement(announcement)
      render_theme = this.renderTheme(theme, theme_article, member)

      if (this.state.tab == "news") {
        render_tab = this.renderNews(news)
        news_active = "active"
      }
      else if (this.state.tab == "announcement") {  
        render_tab = render_announcement
        announcement_active = "active"
      }
    }

    // let loading = this.state.loading
    // let packageItem = loading ? null : <PackageItem item={npmPackage} />
    // let loader = loading ? <Loader /> : null

    return (
      <div className={styles.home}>
        <div className={styles.home_box} style={{margin: "0 10px"}}>
          <div className={styles.home_topic}>
            <div className={styles.left_half}>
              <div className={styles.tabs}>
                <BtnTab text="新聞" active={news_active} changeTab={()=>this.changeTab("news")} />
                <BtnTab text="公告" active={announcement_active} changeTab={()=>this.changeTab("announcement")} />
              </div>
              <div className={styles.home_title}>
                <IconTitle icon_classname="fa fa-home" title="新聞" color="#444" />
              </div>
              { render_tab }
            </div>
            <div className={styles.right_half}>
              <div className={styles.home_title}>
                <IconTitle icon_classname="fa fa-home" title="公告" color="#f00" />
              </div>
              {
                render_announcement
              }
              <a href="/news_list/1" style={{"float": "right", "fontSize": "12px", "color": "#00aaff"}}>檢視全部</a>
              <div className={styles.ad_1}>
                <Ad path="/public/ad/ad18.png" width="300" />
              </div>
            </div>
          </div>
        </div>
        {
          render_theme
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  // if(!isEmpty(state.home)) {
  //   for (var key in state.home) {
  //     if(state.home[key].status == 0 && state.home[key].error.error_code == "00001") 
  //       window.location.href="/error" //系統維護中
  //     else if(state.home[key].status == 0)
  //       console.log(state.home[key].error.error.msg)
  //   }
  // }

  // console.log("home");
  // console.log(state);
  return {
    member: state.member,
    news: state.home.news,
    announcement: state.home.announcement,
    theme: state.home.theme,
    theme_article: state.home.theme_article 
  }
}

export default connect(mapStateToProps)(Home)
