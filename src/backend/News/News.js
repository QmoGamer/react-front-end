import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { apiGetNewsList, apiDeleteNews, apiAddNews } from '../../actions/backend'
import styles from './News.css'
import Loader from '../../components/Loader/Loader'
import { isEmpty, yyyymmdd } from '../../utils'

class News extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { member_cookie: null, auth_token: null }
    this.onClickAddNews = this.onClickAddNews.bind( this )
  }

  componentWillReceiveProps (nextProps) {
    // console.log(nextProps);
    if ( nextProps.action_status.api_status == 1 ) {
      window.location.reload()
    }
    else if ( nextProps.action_status.api_status == 0 ) {
      alert( nextProps.action_status.error_msg )
    }
  }

  componentDidMount () {
    // console.log('did');
    let member_cookie = window.sessionStorage.getItem('cookie')
    let auth_token = window.sessionStorage.getItem('token')

    this.setState({ member_cookie: member_cookie, auth_token: auth_token })
    this.props.dispatch( apiGetNewsList( location.origin ) )
  }

  onClickAddNews() {

    let member_cookie = this.state.member_cookie
    let auth_token = this.state.auth_token

    this.props.dispatch( apiAddNews( location.origin, member_cookie, auth_token ) )
      .then( res => {

        if( res.data.status == 1 ) {

          window.location.href = '/admin/news/update/' + res.data.result.id
        }
        else {

          alert( res.data.error.error_msg )
        }
      })
  }

  renderNewsList( news ) {

    let render = <Loader />

    if ( news != undefined ) {

      render =  <div className="panel-body">
                  <div className={"table-responsive " + styles.table}>
                    <div className="flex">
                      <div style={{"flex": "1"}}>標題</div>
                      <div style={{"flex": "1"}}>類型</div>
                      <div style={{"flex": "1"}}>開始時間</div>
                      <div style={{"flex": "1"}}>結束時間</div>
                      <div style={{"flex": "1"}}>編輯</div>
                    </div>
                    {
                      news.result.map((x, y)=>{

                        let css_type = null
                        let news_type = "無"
                        switch( x.type ) {
                          case "公告":
                            css_type = styles.type_red;
                            news_type = "公告"
                            break;
                          case "新聞":
                            css_type = styles.type_blue;
                            news_type = "新聞"
                            break;
                          default:
                            break;
                        }

                        return (
                          <div key={"news_"+y} className={"flex flex_ai_c " + css_type}>
                            <div style={{"flex": "1"}}>{x.title}</div>
                            <div style={{"flex": "1"}}>{news_type}</div>
                            <div style={{"flex": "1"}}>{yyyymmdd(x.start_time)}</div>
                            <div style={{"flex": "1"}}>{yyyymmdd(x.end_time)}</div>
                            <div style={{"flex": "1", "display": "flex"}}>
                              <div onClick={()=>window.location.href="/admin/news/update/"+x.news_id} className="btn btn-success btn-sm">編輯</div>
                              <div onClick={()=>this.submitDelete( x.news_id )} className="btn btn-danger btn-sm" style={{"marginLeft": "10px"}}>刪除</div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
    }

    return render
  }

  submitDelete ( id ) {
    
    if( confirm("確定刪除嗎?") ) {  
      let member_cookie = this.state.member_cookie
      let auth_token = this.state.auth_token
      let news_id = id
      this.props.dispatch( apiDeleteNews( location.origin, member_cookie, auth_token, news_id ) )
    }
  }

  render () {

    // console.log(this.props);
    const { news } = this.props

    return (
      <div id="page-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="page-header">新聞&公告</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div onClick={this.onClickAddNews} className="btn btn-info btn-sm">新增</div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              { this.renderNewsList( news ) }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    news: state.backend.news,
    action_status: state.backend.action_status
  }
}

export default connect(mapStateToProps)(News)
